require 'test_helper'

class SurveysControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers
  include ActiveJob::TestHelper
  setup do
    @current_user = users(:not_admin)
    @survey = surveys(:one)
    sign_in @current_user
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
    assert_enqueued_jobs 5 # 1 for the survey, 1 for the form update, 2 for questions, 1 for response set
    assert_response :success
    assert_equal 1, Survey.last.forms.length
    assert_equal 'GSP', Survey.last.surveillance_program.acronym
  end

  test 'should show survey' do
    get survey_url(@survey)
    assert_response :success
  end

  test 'should destroy survey and surveyforms' do
    assert_enqueued_jobs 0
    post forms_url(format: :json), params: { form: { name: 'Create test form', created_by_id: @survey.created_by_id, linked_questions: [nil], linked_response_sets: [nil] } }
    post surveys_url(format: :json), params: { survey: { name: 'Create test survey', created_by_id: @survey.created_by_id, linked_forms: [Form.last.id] } }
    assert_difference('Survey.count', -1) do
      assert_difference('SurveyForm.count', -1) do
        assert_difference('Form.count', 0) do
          delete survey_url(Survey.last)
        end
      end
    end
    assert_enqueued_jobs 5
  end

  test 'should publish a survey' do
    assert_equal 'draft', @survey.status
    put publish_survey_url(@survey)
    assert_response :success
    @survey.reload
    assert_equal 'published', @survey.status
  end

  test 'should not publish a published survey' do
    @survey = surveys(:two)
    put publish_survey_url(@survey)
    assert_response :unprocessable_entity
  end

  test 'publishers should see surveys from other authors' do
    sign_out @current_user
    @current_publisher = users(:publisher)
    sign_in @current_publisher
    get survey_url(surveys(:one), format: :json)
    assert_response :success
  end

  test 'publishers should be able to publish surveys' do
    sign_out @current_user
    @current_publisher = users(:publisher)
    sign_in @current_publisher
    put publish_survey_path(surveys(:one), format: :json, params: {survey: surveys(:one)})
    assert_response :success
  end

  test 'authors should not be able to publish surveys' do
    put publish_survey_path(surveys(:one),format: :json,  params: {survey: surveys(:one)})
    assert_response :forbidden
  end
end
