require 'test_helper'

class QuestionResponseSetsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @question_response_set = question_response_sets(:one)
    sign_in users(:admin)
  end

  test 'should get index' do
    get question_response_sets_url
    assert_response :success
  end

  test 'should get new' do
    get new_question_response_set_url
    assert_response :success
  end

  test 'should create question_response_set' do
    assert_difference('QuestionResponseSet.count') do
      post question_response_sets_url, params: { question_response_set: { question_id: @question_response_set.question_id, response_set_id: @question_response_set.response_set_id } }
    end

    assert_redirected_to question_response_set_url(QuestionResponseSet.last)
  end

  test 'should show question_response_set' do
    get question_response_set_url(@question_response_set)
    assert_response :success
  end

  test 'should get edit' do
    get edit_question_response_set_url(@question_response_set)
    assert_response :success
  end

  test 'should update question_response_set' do
    patch question_response_set_url(@question_response_set), params: { question_response_set: { question_id: @question_response_set.question_id, response_set_id: @question_response_set.response_set_id } }
    assert_redirected_to question_response_set_url(@question_response_set)
  end

  test 'should destroy question_response_set' do
    assert_difference('QuestionResponseSet.count', -1) do
      delete question_response_set_url(@question_response_set)
    end

    assert_redirected_to question_response_sets_url
  end
end
