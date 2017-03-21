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
      post surveys_url, params: { survey: {name: 'Test' }}
    end

    assert_response :success
  end

  test 'should show response' do
    get survey_url(@survey)
    assert_response :success
  end

  # test 'should get edit' do
  #   get edit_response_url(@resp)
  #   assert_response :success
  # end
  #
  # test 'should update response' do
  #   patch response_url(@resp), params: { response: { response_set_id: @response_set.id, value: 'one' } }
  #   assert_redirected_to response_url(@resp)
  # end
  #
  test 'should destroy response' do
    assert_difference('Survey.count', -1) do
      delete survey_url(@survey)
    end
  end
end
