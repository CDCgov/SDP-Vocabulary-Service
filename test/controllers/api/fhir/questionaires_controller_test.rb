require 'test_helper'
module Api
  module Fhir
    class QuestionairesControllerTest < ActionDispatch::IntegrationTest
      include Devise::Test::IntegrationHelpers
      include ActiveModelSerializers::Test::Schema
      include ActiveModelSerializers::Test::Serializer

      setup do
        @current_user = users(:admin)
        @survey = surveys(:one)
        sign_in @current_user
      end

      test 'api should get index' do
        get api_fhir_questionaires_url
        res = JSON.parse response.body
        assert_equal Survey.where("(status='published' )").count, res['entry'].count
        assert_response :success
        assert_json_schema('fhir/Bundle.schema.json', res)
      end

      test 'api should show survey' do
        get api_fhir_questionaire_url(@survey.version_independent_id)
        assert_response :success
        assert_json_schema_response('fhir/Questionnaire.json')
        res = JSON.parse response.body
        meta = res['meta']
        assert meta
        tags = meta['tag']
        assert tags
        assert_equal 'Generic', tags[0]['code']

        sections = res['item']
        assert sections
        assert_equal 2, sections.length
      end

      test 'api should provide program variables' do
        get api_fhir_questionaire_url(@survey.version_independent_id)
        assert_response :success
        assert_json_schema_response('fhir/Questionnaire.json')
        res = JSON.parse response.body
        extension = res['item'][0]['item'][0]['extension']
        assert extension
        program_var = extension.find { |e| e['url'] == 'https://sdp-v.services.cdc.gov/fhir/questionnaire-item-program-var' }
        assert program_var
        assert_equal 'MyString', program_var['valueString']
      end

      test 'api should use the data element identifier as the link id' do
        get api_fhir_questionaire_url(@survey.version_independent_id)
        assert_response :success
        assert_json_schema_response('fhir/Questionnaire.json')
        res = JSON.parse response.body
        link_id = res['item'][0]['item'][0]['linkId']
        assert link_id
        assert_equal '1234-5', link_id
      end

      test 'api should show survey of specific version' do
        get api_fhir_questionaire_url(@survey.version_independent_id, version: 1)
        assert_response :success
        res = JSON.parse response.body
        assert_equal(res['version'], '1')

        assert_json_schema('fhir/Questionnaire.json', res)
      end

      test 'api should 404 on survey that doesnt exist' do
        get api_fhir_questionaire_url(99)
        assert_response :not_found
        res = JSON.parse response.body
        assert_equal(res['message'], 'Resource Not Found')
      end

      test 'api should 404 on survey version that doesnt exist' do
        get api_fhir_questionaire_url(@survey.version_independent_id, version: 99)
        assert_response :not_found
        res = JSON.parse response.body
        assert_equal(res['message'], 'Resource Not Found')
      end
    end
  end
end
