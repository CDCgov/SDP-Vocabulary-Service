# rubocop:disable Metrics/ModuleLength
# rubocop:disable Metrics/MethodLength
# rubocop:disable Metrics/ParameterLists
# rubocop:disable Metrics/PerceivedComplexity
# rubocop:disable Metrics/AbcSize
# rubocop:disable Metrics/CyclomaticComplexity
# rubocop:disable Metrics/BlockLength

module SDP
  module Elasticsearch
    class BatchDuplicateFinder
      def initialize
        @potential_duplicates = []
      end

      def add_to_batch(obj, category, &block)
        @potential_duplicates << { object: obj, category: category, filter: block }
      end

      def execute(current_user_id = nil, groups = [])
        batch_results = {}
        result = SDP::Elasticsearch.batch_find_duplicates(@potential_duplicates.map { |pd| pd[:object] }, current_user_id, groups)
        if !result.nil? && result['responses']
          result['responses'].each_with_index do |resp, i|
            pd = @potential_duplicates[i]
            filter_result = pd[:filter].call(resp)
            if filter_result
              batch_results[pd[:category]] ||= []
              batch_results[pd[:category]] << filter_result
            end
          end
        end
        batch_results
      end
    end

    MAX_DUPLICATE_QUESTION_SUGGESTIONS = 10

    def self.with_client
      client = Vocabulary::Elasticsearch.client
      yield client if client.ping
    end

    def self.ping
      Vocabulary::Elasticsearch.client.ping
    rescue
      return false
    end

    def self.search(type, query_string, page, query_size = 10, must_filters = {}, current_user_id = nil, groups = [])
      version_filter = if must_filters['current_version']
                         { bool: { filter: {
                           term: { 'most_recent': true }
                         } } }
                       else
                         {}
                       end

      # This check ensures the > doesn't crash on nil
      must_filters['group_id'] = must_filters['group_id'] || 0
      group_filter = if must_filters['group_id'] == -1
                       { bool: { filter: {
                         terms: { groups: groups }
                       } } }
                     elsif must_filters['group_id'] > 0
                       { bool: { filter: {
                         terms: { groups: [must_filters['group_id']] }
                       } } }
                     else
                       {}
                     end

      filter_body = if must_filters['mystuff']
                      { dis_max: { queries: [
                        { term: { 'createdBy.id': current_user_id } }
                      ] } }
                    elsif must_filters['publisher']
                      {}
                    else
                      { dis_max: { queries: [
                        { term: { 'createdBy.id': current_user_id } },
                        { match: { status: 'published' } },
                        { terms: { groups: groups } }
                      ] } }
                    end

      must_body = if query_string.blank?
                    {}
                  elsif query_string.include?('"')
                    # If the string has double quotes it should be exact match
                    { query_string: { query: query_string, fields: [
                      'name', 'description', 'codes.code', 'codes.codeSystem', 'codes.displayName',
                      'tag_list', 'category', 'subcategory', 'createdBy.email', 'createdBy.name',
                      'status', 'content_stage', 'oid', 'version_independent_id', 'controlNumber'
                    ] } }
                  else
                    { dis_max: { queries: [
                      { match: { name: { query: query_string, boost: 9, fuzziness: 'AUTO' } } },
                      { match: { description: { query: query_string, boost: 8, fuzziness: 'AUTO' } } },
                      { match: { 'codes.code': { query: query_string, boost: 7, fuzziness: 'AUTO' } } },
                      { match: { 'codes.codeSystem': { query: query_string, boost: 7, fuzziness: 'AUTO' } } },
                      { match: { 'codes.displayName': { query: query_string, boost: 7, fuzziness: 'AUTO' } } },
                      { match: { tag_list: { query: query_string, boost: 9, fuzziness: 'AUTO' } } },
                      { match: { category: { query: query_string, fuzziness: 'AUTO' } } },
                      { match: { subcategory: { query: query_string, fuzziness: 'AUTO' } } },
                      { match: { 'createdBy.email': { query: query_string, fuzziness: 'AUTO' } } },
                      { match: { 'createdBy.name': { query: query_string, fuzziness: 'AUTO' } } },
                      { match: { status: { query: query_string } } },
                      { match: { content_stage: { query: query_string } } },
                      { match: { oid: { query: query_string, boost: 20 } } },
                      { match: { controlNumber: { query: query_string, boost: 20 } } },
                      { match: { version_independent_id: { query: query_string } } }
                    ] } }
                  end

      highlight_body = if query_string.blank?
                         {}
                       else
                         {
                           pre_tags: ['<strong>'], post_tags: ['</strong>'],
                           fields: {
                             name: {}, description: {}
                           }
                         }
                       end

      # prog_name = type == 'survey' ? 'surveillance_program' : 'surveillance_programs'
      # sys_name = type == 'survey' ? 'surveillance_system' : 'surveillance_systems'

      ns_terms = if must_filters['nested_section'].blank?
                   {}
                 else
                   { term: { 'id': must_filters['nested_section'] } }
                 end

      retired_terms = if must_filters['retired'].blank?
                        { match: { content_stage: 'Retired' } }
                      else
                        {}
                      end

      must_filters['data_collection_methods'] = must_filters['data_collection_methods'] || []
      methods_terms = if must_filters['data_collection_methods'].empty?
                        {}
                      else
                        { 'terms': { 'data_collection_methods.keyword': must_filters['data_collection_methods'] } }
                      end

      must_filters['programs'] = must_filters['programs'] || []
      prog_terms = if must_filters['programs'].empty?
                     {}
                   else
                     { dis_max: { queries: [
                       { 'terms': { 'surveillance_programs.id': must_filters['programs'] } },
                       { 'terms': { 'surveillance_program.id': must_filters['programs'] } }
                     ] } }
                   end

      must_filters['systems'] = must_filters['systems'] || []
      sys_terms = if must_filters['systems'].empty?
                    {}
                  else
                    { dis_max: { queries: [
                      { 'terms': { 'surveillance_systems.id': must_filters['systems'] } },
                      { 'terms': { 'surveillance_system.id': must_filters['systems'] } }
                    ] } }
                  end

      date_terms = if must_filters['content_since'].present?
                     { range: { createdAt: { gte: must_filters['content_since'] } } }
                   else
                     {}
                   end

      ombd_terms = if must_filters['omb_approval_date'].present?
                     { range: { ombApprovalDate: { gte: must_filters['omb_approval_date'] } } }
                   else
                     {}
                   end

      omb_terms = if must_filters['omb']
                    { term: { 'omb': true } }
                  else
                    {}
                  end

      preferred_terms = if must_filters['preferred']
                          { term: { 'preferred': true } }
                        else
                          {}
                        end

      status_terms = if must_filters['status'].blank?
                       {}
                     else
                       { term: { 'status': must_filters['status'] } }
                     end

      stage_terms = if must_filters['stage'].blank?
                      {}
                    else
                      { match: { content_stage: must_filters['stage'] } }
                    end

      category_terms = if must_filters['category'].blank?
                         {}
                       else
                         { term: { 'category.name': must_filters['category'] } }
                       end

      rt_terms = if must_filters['rt'].blank?
                   {}
                 else
                   { term: { 'response_type.name': must_filters['rt'] } }
                 end

      source_terms = if must_filters['source'].blank?
                       {}
                     else
                       { term: { 'source': must_filters['source'] } }
                     end

      sort_body = case must_filters['sort']
                  when 'Program Usage'
                    [
                      { '_script': {
                        'script': "doc['surveillance_programs.id'].values.size()",
                        type: 'number',
                        order: 'desc'
                      } },
                      { 'preferred': { order: 'desc' } },
                      '_score'
                    ]
                  when 'System Usage'
                    [
                      { '_script': {
                        'script': "doc['surveillance_systems.id'].values.size()",
                        type: 'number',
                        order: 'desc'
                      } },
                      { 'preferred': { order: 'desc' } },
                      '_score'
                    ]
                  else
                    [
                      { 'preferred': { order: 'desc' } },
                      '_score',
                      { '_script': {
                        'script': "doc['surveillance_systems.id'].values.size()",
                        type: 'number',
                        order: 'desc'
                      } }
                    ]
                  end

      from_index = (page - 1) * query_size
      search_body = {
        size: query_size,
        from: from_index,
        query: {
          bool: {
            filter: { bool: {
              filter: [filter_body, version_filter, group_filter],
              must: [
                prog_terms, sys_terms, date_terms, omb_terms, ombd_terms,
                preferred_terms, status_terms, source_terms, rt_terms,
                category_terms, methods_terms, stage_terms
              ],
              must_not: [ns_terms, retired_terms]
            } },
            must: must_body
          }
        },
        sort: sort_body,
        highlight: highlight_body
      }

      with_client do |client|
        results = if query_string
                    SDP::Elasticsearch.search_on_string(client, type, search_body)
                  elsif type
                    client.search index: 'vocabulary', type: type, body: search_body
                  else
                    client.search index: 'vocabulary', body: search_body
                  end
        return results
      end
    end

    def self.search_on_string(client, type, search_body)
      if type
        client.search index: 'vocabulary', type: type, body: search_body
      else
        client.search index: 'vocabulary', body: search_body
      end
    end

    def self.find_duplicates(obj, current_user_id = nil, groups = [])
      sort_body = ['_score', { '_script': {
        'script': "doc['surveillance_systems.id'].values.size()",
        type: 'number',
        order: 'desc'
      } }]

      version_filter = { term: { 'most_recent': true } }

      filter_body = { dis_max: { queries: [
        { term: { 'createdBy.id': current_user_id } },
        { match: { status: 'published' } },
        { terms: { groups: groups } }
      ] } }

      mlt_body = {
        more_like_this: {
          fields: ['name', 'description', 'codes.code', 'codes.codeSystem', 'codes.displayName', 'category.name', 'subcategory.name'],
          like: [
            {
              '_type': obj.class.to_s.underscore,
              '_id': obj.id
            }
          ],
          min_term_freq: 1,
          minimum_should_match: '75%'
        }
      }

      search_body = {
        size: 10,
        query: {
          bool: {
            filter: [filter_body, version_filter],
            must: [mlt_body]
          }
        },
        sort: sort_body
      }

      with_client do |client|
        results = client.search index: 'vocabulary', type: obj.class.to_s.underscore, body: search_body
        return results
      end
    end

    def self.find_duplicate_questions(content, description)
      with_client do |client|
        client.search(index: 'vocabulary', type: 'question',
                      body: {
                        query: {
                          bool: {
                            filter: { match: { status: 'published' } },
                            should: [{ match: { name: content } }, { match: { description: description } }],
                            minimum_should_match: '75%'
                          }
                        },
                        size: MAX_DUPLICATE_QUESTION_SUGGESTIONS
                      })
      end
    end

    def self.batch_find_duplicates(objs, current_user_id = nil, groups = [])
      search_body = []

      sort_body = ['_score', { '_script': {
        'script': "doc['surveillance_systems.id'].values.size()",
        type: 'number',
        order: 'desc'
      } }]

      version_filter = { term: { 'most_recent': true } }

      filter_body = { dis_max: { queries: [
        { term: { 'createdBy.id': current_user_id } },
        { match: { status: 'published' } },
        { terms: { groups: groups } }
      ] } }

      objs.each do |obj|
        search_body << { index: 'vocabulary', type: obj.class.to_s.underscore }

        mlt_body = {
          more_like_this: {
            fields: [
              'name', 'description', 'codes.code', 'codes.codeSystem', 'codes.displayName',
              'tag_list', 'category', 'subcategory', 'oid', 'controlNumber'
            ],
            like: [
              {
                '_type': obj.class.to_s.underscore,
                '_id': obj.id
              }
            ],
            min_term_freq: 1,
            minimum_should_match: '85%'
          }
        }

        individual_search_body = {
          size: 10,
          query: {
            bool: {
              filter: [filter_body, version_filter],
              must: [mlt_body],
              must_not:[{match: { content_stage: 'Retired' } }]
            }
          },
          highlight: {
            pre_tags: ['<strong>'], post_tags: ['</strong>'],
            fields: {
              'name': {}, 'description': {}, 'codes.code': {}, 'codes.codeSystem': {}, 'codes.displayName': {},
              'tag_list': {}, 'category': {}, 'subcategory': {}, 'oid': {}, 'controlNumber': {}
            }
          },
          sort: sort_body
        }

        search_body << individual_search_body
      end
      with_client do |client|
        client.msearch(body: search_body) unless search_body.empty?
      end
    end

    def self.find_suggestions(prefix)
      with_client do |client|
        client.search(index: 'vocabulary', body: {
                        _source: 'version',
                        suggest: {
                          search_suggest: {
                            prefix: prefix,
                            completion: {
                              field: 'suggest',
                              size: 10,
                              fuzzy: {
                                min_length: 4
                              }
                            }
                          }
                        }
                      })
      end
    end

    def self.ensure_index
      with_client do |client|
        unless client.indices.exists? index: 'vocabulary'
          # create the index
          json = JSON.parse(File.read(File.join(File.dirname(__FILE__), '../../docs/elastic_search_schema.json')))
          client.indices.create index: 'vocabulary',
                                body:  json
        end
      end
    end

    def self.delete_index
      with_client do |client|
        if client.indices.exists? index: 'vocabulary'
          # delete the index
          client.indices.delete index: 'vocabulary'
        end
      end
    end

    def self.delete_item(type, id, refresh = false)
      ensure_index
      with_client do |client|
        if client.exists?(index: 'vocabulary', type: type.underscore, id: id)
          client.delete index: 'vocabulary', type: type.underscore, id: id, refresh: refresh
        end
      end
    end

    def self.sync
      sync_sections
      sync_questions
      sync_response_sets
      sync_surveys
    end

    def self.sync_now
      sync_sections('now')
      sync_questions('now')
      sync_response_sets('now')
      sync_surveys('now')
    end

    def self.sync_sections(delay = 'later')
      ensure_index
      with_client do |_client|
        delete_all('section', Section.ids)
        Section.all.each do |section|
          UpdateIndexJob.send("perform_#{delay}", 'section', section.id)
        end
      end
    end

    def self.sync_questions(delay = 'later')
      ensure_index
      with_client do |_client|
        delete_all('question', Question.ids)
        Question.all.each do |question|
          UpdateIndexJob.send("perform_#{delay}", 'question', question.id)
        end
      end
    end

    def self.sync_response_sets(delay = 'later')
      ensure_index
      with_client do |_client|
        delete_all('response_set', ResponseSet.ids)
        ResponseSet.all.each do |response_set|
          UpdateIndexJob.send("perform_#{delay}", 'response_set', response_set.id)
        end
      end
    end

    def self.sync_surveys(delay = 'later')
      ensure_index
      with_client do |_client|
        delete_all('survey', Survey.ids)
        Survey.all.each do |survey|
          UpdateIndexJob.send("perform_#{delay}", 'survey', survey.id)
        end
      end
    end

    def self.delete_all(type, ids)
      with_client do |client|
        client.delete_by_query index: 'vocabulary',
                               type: type,
                               body: { query: { bool: { must_not: { terms: { id: ids } } } } }
      end
    end
  end
end
# rubocop:enable Metrics/ModuleLength
# rubocop:enable Metrics/MethodLength
# rubocop:enable Metrics/ParameterLists
# rubocop:enable Metrics/PerceivedComplexity
