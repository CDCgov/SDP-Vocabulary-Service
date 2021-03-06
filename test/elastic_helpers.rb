require 'fakeweb'
require 'json'
require_relative '../lib/sdp/elastic_search'

module Elastictest
  def self.fake_all_search_results
    # Craft Response
    questions = Question.all
    response_sets = ResponseSet.all
    sections = Section.all
    surveys = Survey.all

    fake_body = <<-EOS
    {"took":1,"timed_out":false,"_shards":{"total":#{questions.size + response_sets.size + sections.size},"successful":5,"failed":0},
    "hits":{"total":#{questions.size + response_sets.size + sections.size},"max_score":2.7132807,"hits":[
    EOS

    fake_body += fake_results('question', questions)
    previous_hits = questions.any?

    fake_body += previous_hits && response_sets.any? ? ',' : ''
    fake_body += fake_results('response_set', response_sets)
    previous_hits ||= response_sets.any?

    fake_body += previous_hits && sections.any? ? ',' : ''
    fake_body += fake_results('section', sections)
    previous_hits ||= sections.any?

    fake_body += previous_hits && surveys.any? ? ',' : ''
    fake_body += fake_results('survey', surveys)

    fake_body += ']}}'
    msearch_body = '{"responses":[' + [fake_body, fake_body, fake_body].join(',') + ']}'
    FakeWeb.register_uri(:any, %r{http://example\.com:9200/}, body: fake_body, content_type: 'application/json')
    FakeWeb.register_uri(:get, %r{http://example\.com:9200/_msearch}, body: msearch_body, content_type: 'application/json')
  end

  def self.fake_results(result_type, results)
    fake_body  = ''
    serializer = "ES#{result_type.classify}Serializer".constantize
    results.each_with_index do |result, index|
      fake_body += "{\"_index\":\"#{result_type}\",\"_type\":\"#{result_type}\",\"_id\":\"#{result.id}\",\"_score\":2.1132807,\"_source\":"
      fake_body += serializer.new(result).to_json
      fake_body += index != results.size - 1 ? '},' : '}'
    end
    fake_body
  end

  def self.fake_question_search_results
    questions = Question.all
    fake_body = <<-EOS
    {"took":1,"timed_out":false,"_shards":{"total":#{questions.size},"successful":5,"failed":0},
    "hits":{"total":#{questions.size},"max_score":2.7132807,"hits":[
    EOS
    fake_body += fake_results('question', questions)
    fake_body += ']}}'
    FakeWeb.register_uri(:any, %r{http://example\.com:9200/}, body: fake_body, content_type: 'application/json')
  end

  def self.fake_rs_search_results
    response_sets = ResponseSet.all
    fake_body = <<-EOS
    {"took":1,"timed_out":false,"_shards":{"total":#{response_sets.size},"successful":5,"failed":0},
    "hits":{"total":#{response_sets.size},"max_score":2.7132807,"hits":[
    EOS
    fake_body += fake_results('response_set', response_sets)
    fake_body += ']}}'
    FakeWeb.register_uri(:any, %r{http://example\.com:9200/}, body: fake_body, content_type: 'application/json')
  end

  def self.fake_section_search_results
    sections = Section.all
    fake_body = <<-EOS
    {"took":1,"timed_out":false,"_shards":{"total":#{sections.size},"successful":5,"failed":0},
    "hits":{"total":#{sections.size},"max_score":2.7132807,"hits":[
    EOS
    fake_body += fake_results('section', sections)
    fake_body += ']}}'

    FakeWeb.register_uri(:any, %r{http://example\.com:9200/}, body: fake_body, content_type: 'application/json')
  end

  def self.fake_section_search_results_except(name_filter)
    sections = Section.all.where.not(name: name_filter)
    fake_body = <<-EOS
    {"took":1,"timed_out":false,"_shards":{"total":#{sections.size},"successful":5,"failed":0},
    "hits":{"total":#{sections.size},"max_score":2.7132807,"hits":[
    EOS
    fake_body += fake_results('section', sections)
    fake_body += ']}}'

    FakeWeb.register_uri(:any, %r{http://example\.com:9200/}, body: fake_body, content_type: 'application/json')
  end

  def self.fake_survey_search_results
    surveys = Survey.all
    fake_body = <<-EOS
    {"took":1,"timed_out":false,"_shards":{"total":#{surveys.size},"successful":5,"failed":0},
    "hits":{"total":#{surveys.size},"max_score":2.7132807,"hits":[
    EOS
    fake_body += fake_results('survey', surveys)
    fake_body += ']}}'
    FakeWeb.register_uri(:any, %r{http://example\.com:9200/}, body: fake_body, content_type: 'application/json')
  end
end
