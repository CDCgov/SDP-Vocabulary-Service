require 'test_helper'

class SurveysControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers
  include ActiveJob::TestHelper
  setup do
    @survey = surveys(:one)
    sign_in users(:admin)
  end

  test 'should get index' do
    get surveys_url
    assert_response :success
  end

  test 'should get new' do
    get new_survey_url
    assert_response :success
  end

  test 'should create survey' do
    assert_enqueued_jobs 0
    assert_difference('Survey.count') do
      post surveys_url params: { survey: { linked_forms: [forms(:one).id], name: 'Test' } }
    end
    assert_enqueued_jobs 2 # one for the survey one for the form update
    assert_response :success
    assert_equal 1, Survey.last.forms.length
  end

  test 'should show survey' do
    get survey_url(@survey)
    assert_response :success
  end

  test 'should destroy survey' do
    assert_enqueued_jobs 0
    assert_difference('Survey.count', -1) do
      delete survey_url(@survey)
    end
    assert_enqueued_jobs 3
  end

  test 'should publish a survey' do
    assert_equal 'draft', @survey.status
    @survey.publish
    put survey_url(@survey), params: { survey: { linked_forms: [forms(:one).id], name: @survey.name, status: @survey.status, control_number: '9876-5432' } }
    assert_response :success
  end

  test 'should not publish a published survey' do
    @survey = surveys(:two)
    put survey_url(@survey), params: { survey: { linked_forms: [forms(:one).id], name: @survey.name, status: @survey.status, control_number: '9876-5432' } }
    assert_response :unprocessable_entity
  end
end
