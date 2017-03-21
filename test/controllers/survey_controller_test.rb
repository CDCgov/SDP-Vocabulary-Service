require 'test_helper'

class SurveysControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

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
    assert_difference('Survey.count') do
      post surveys_url params: { survey: { linked_forms: [forms(:one).id], name: 'Test' } }
    end

    assert_response :success
    assert_equal 1, Survey.last.forms.length
  end

  test 'should show response' do
    get survey_url(@survey)
    assert_response :success
  end

  test 'should destroy response' do
    assert_difference('Survey.count', -1) do
      delete survey_url(@survey)
    end
  end
end
