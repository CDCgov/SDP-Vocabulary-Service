require 'test_helper'

class SurveysControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers
  include ActiveModelSerializers::Test::Schema
  include ActiveModelSerializers::Test::Serializer

  setup do
    @survey = surveys(:one)
    sign_in users(:admin)
  end

  test 'api should get index' do
    get api_surveys_url
    res = JSON.parse response.body
    assert_equal Survey.latest_versions.count, res.count
    assert_response :success
    assert_response_schema('surveys/show.json')
  end

  test 'api should show survey' do
    get api_survey_url(@survey.version_independent_id)
    assert_response :success
    assert_serializer 'SurveySerializer'
    assert_response_schema('surveys/show.json')
  end

  test 'api should show survey of specific version' do
    get api_survey_url(@survey.version_independent_id, version: 1)
    assert_response :success
    res = JSON.parse response.body
    assert_equal(res['version'], 1)
  end

  test 'api should 404 on survey that doesnt exist' do
    get api_survey_url(99)
    assert_response :not_found
    res = JSON.parse response.body
    assert_equal(res['message'], 'Resource Not Found')
  end

  test 'api should 404 on survey version that doesnt exist' do
    get api_survey_url(@survey.version_independent_id, version: 99)
    assert_response :not_found
    res = JSON.parse response.body
    assert_equal(res['message'], 'Resource Not Found')
  end
end
