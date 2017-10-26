# rubocop:disable Metrics/ModuleLength
# rubocop:disable Metrics/MethodLength
# rubocop:disable Metrics/ParameterLists
module SDP
  module Elasticsearch
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

    def self.search(type, query_string, page, query_size = 10,
                    current_user_id = nil, publisher_search = false,
                    my_stuff_filter = false, program_filter = [],
                    system_filter = [])

      filter_body = if my_stuff_filter
                      { dis_max: { queries: [
                        { term: { 'createdBy.id': current_user_id } }
                      ] } }
                    elsif publisher_search
                      {}
                    else
                      { dis_max: { queries: [
                        { term: { 'createdBy.id': current_user_id } },
                        { match: { status: 'published' } }
                      ] } }
                    end

      must_body = if query_string.blank?
                    {}
                  else
                    { dis_max: { queries: [
                      { match: { name: { query: query_string, boost: 9 } } },
                      { match: { description: { query: query_string, boost: 8 } } },
                      { match: { 'codes.code': { query: query_string, boost: 7 } } },
                      { match: { 'codes.codeSystem': { query: query_string, boost: 7 } } },
                      { match: { 'codes.displayName': { query: query_string, boost: 7 } } },
                      { match: { category: { query: query_string } } },
                      { match: { 'createdBy.email': { query: query_string } } },
                      { match: { 'createdBy.name': { query: query_string } } },
                      { match: { status: { query: query_string } } }
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

      prog_terms = if program_filter.empty?
                     {}
                   else
                     { dis_max: { queries: [
                       { 'terms': { 'surveillance_programs.id': program_filter } },
                       { 'terms': { 'surveillance_program.id': program_filter } }
                     ] } }
                   end

      sys_terms = if system_filter.empty?
                    {}
                  else
                    { dis_max: { queries: [
                      { 'terms': { 'surveillance_systems.id': system_filter } },
                      { 'terms': { 'surveillance_system.id': system_filter } }
                    ] } }
                  end

      from_index = (page - 1) * query_size
      search_body = {
        size: query_size,
        from: from_index,
        query: {
          bool: {
            filter: { bool: { filter: filter_body, must: [prog_terms, sys_terms] } },
            must: must_body
          }
        },
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
