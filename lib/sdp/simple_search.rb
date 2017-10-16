# rubocop:disable Metrics/ParameterLists
module SDP
  module SimpleSearch
    MAX_DUPLICATE_QUESTION_SUGGESTIONS = 10

    def self.search(type, query_string, current_user_id = nil, limit = 10, page = 1, publisher_search = false, my_stuff_search = false)
      current_user_id = current_user_id == -1 ? nil : current_user_id
      types = [type.camelize.constantize] if type
      types ||= [Section, Question, ResponseSet, Survey]
      results = {}
      types.map do |search_type|
        query = search_type.search(query_string, current_user_id, publisher_search, my_stuff_search)
        count = query.count()
        results[search_type] = { total: count, hits: query.limit(limit).offset(limit * (page - 1)).to_a }
      end
      render_results(results)
    end

    def self.find_duplicate_questions(content)
      query = Question.search(content)
      results = {}
      count = query.count()
      results[Question] = { total: count, hits: query.limit(MAX_DUPLICATE_QUESTION_SUGGESTIONS).to_a }
      render_results(results)
    end

    def self.render_results(results)
      json_results = []
      total = 0
      mapping = { Section => ESSectionSerializer,
                  Question => ESQuestionSerializer,
                  ResponseSet => ESResponseSetSerializer,
                  Survey => ESSurveySerializer }
      types = [Question, ResponseSet, Section, Survey]
      types.each do |type|
        type_results = results[type]

        next unless type_results
        total += type_results[:total]
        type_results[:hits].each do |tr|
          serializer = mapping[type]
          res_json = { '_index' => 'vocabulary',
                       '_type' => type.to_s.underscore,
                       '_id' => tr.id,
                       '_source' => serializer.new(tr).as_json }
          json_results << res_json
        end
      end

      Jbuilder.new do |json|
        json._source 'simple_search'
        json.took 1
        json.timed_out  false
        json._shards do |shard|
          shard.total 1
          shard.successful 1
          shard.failed 0
        end
        json.hits do |hit|
          hit.total total
          hit.hits json_results
        end
      end
    end
  end
end
# rubocop:enable Metrics/ParameterLists
