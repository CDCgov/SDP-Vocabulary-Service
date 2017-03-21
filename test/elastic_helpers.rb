# rubocop:disable Metrics/MethodLength
require 'fakeweb'
require 'json'
require_relative '../lib/sdp/elastic_search'

module Elastictest
  def self.fake_all_search_results
    # Craft Response
    questions = Question.all
    response_sets = ResponseSet.all
    forms = Form.all

    fake_body = <<-EOS
    {"took":1,"timed_out":false,"_shards":{"total":#{questions.size + response_sets.size + forms.size},"successful":5,"failed":0},
    "hits":{"total":2,"max_score":2.7132807,"hits":[
    EOS
    questions.each_with_index do |question, index|
      fake_body += "{\"_index\":\"vocabulary\",\"_type\":\"question\",\"_id\":\"#{question.id}\",\"_score\":2.1132807,\"_source\":"
      fake_body += ESQuestionSerializer.new(question).to_json
      fake_body += index != questions.size - 1 ? '},' : '}'
    end

    fake_body += response_sets.any? ? ',' : ''
    response_sets.each_with_index do |response_set, index|
      fake_body += "{\"_index\":\"vocabulary\",\"_type\":\"response_set\",\"_id\":\"#{response_set.id}\",\"_score\":2.1132807,\"_source\":"
      fake_body += ESResponseSetSerializer.new(response_set).to_json
      fake_body += index != response_sets.size - 1 ? '},' : '}'
    end

    fake_body += forms.any? ? ',' : ''
    forms.each_with_index do |form, index|
      fake_body += "{\"_index\":\"vocabulary\",\"_type\":\"form\",\"_id\":\"#{form.id}\",\"_score\":2.1132807,\"_source\":"
      fake_body += ESFormSerializer.new(form).to_json
      fake_body += index != forms.size - 1 ? '},' : '}'
    end

    fake_body += ']}}'
    FakeWeb.register_uri(:any, %r{http://example\.com:9200/}, body: fake_body, content_type: 'application/json')
  end

  def self.fake_question_search_results
    # Craft Response
    questions = Question.all
    fake_body = <<-EOS
    {"took":1,"timed_out":false,"_shards":{"total":#{questions.size},"successful":5,"failed":0},
    "hits":{"total":2,"max_score":2.7132807,"hits":[
    EOS
    questions.each_with_index do |question, index|
      fake_body += "{\"_index\":\"vocabulary\",\"_type\":\"question\",\"_id\":\"#{question.id}\",\"_score\":2.1132807,\"_source\":"
      fake_body += ESQuestionSerializer.new(question).to_json
      fake_body += index != questions.size - 1 ? '},' : ''
    end
    fake_body += questions.any? ? '}]}}' : ']}}'

    FakeWeb.register_uri(:any, %r{http://example\.com:9200/}, body: fake_body, content_type: 'application/json')
  end

  def self.fake_rs_search_results
    # Craft Response
    response_sets = ResponseSet.all
    fake_body = <<-EOS
    {"took":1,"timed_out":false,"_shards":{"total":#{response_sets.size},"successful":5,"failed":0},
    "hits":{"total":2,"max_score":2.7132807,"hits":[
    EOS
    response_sets.each_with_index do |response_set, index|
      fake_body += "{\"_index\":\"vocabulary\",\"_type\":\"response_set\",\"_id\":\"#{response_set.id}\",\"_score\":2.1132807,\"_source\":"
      fake_body += ESResponseSetSerializer.new(response_set).to_json
      fake_body += index != response_sets.size - 1 ? '},' : ''
    end
    fake_body += response_sets.any? ? '}]}}' : ']}}'

    FakeWeb.register_uri(:any, %r{http://example\.com:9200/}, body: fake_body, content_type: 'application/json')
  end

  def self.fake_form_search_results
    # Craft Response
    forms = Form.all
    fake_body = <<-EOS
    {"took":1,"timed_out":false,"_shards":{"total":#{forms.size},"successful":5,"failed":0},
    "hits":{"total":2,"max_score":2.7132807,"hits":[
    EOS
    forms.each_with_index do |form, index|
      fake_body += "{\"_index\":\"vocabulary\",\"_type\":\"form\",\"_id\":\"#{form.id}\",\"_score\":2.1132807,\"_source\":"
      fake_body += ESFormSerializer.new(form).to_json
      fake_body += index != forms.size - 1 ? '},' : ''
    end
    fake_body += forms.any? ? '}]}}' : ']}}'

    FakeWeb.register_uri(:any, %r{http://example\.com:9200/}, body: fake_body, content_type: 'application/json')
  end
end
# rubocop:enable Metrics/MethodLength
