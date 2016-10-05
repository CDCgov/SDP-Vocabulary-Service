require 'test_helper'

class QuestionsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @question = questions(:one)
    sign_in users(:admin)
  end

  test 'should get index' do
    get questions_url
    assert_response :success
  end

  test 'should get new' do
    get new_question_url
    assert_response :success
  end

  test 'should create question' do
    assert_difference('Question.count') do
      post questions_url, params: { question: { author: @question.author, content: @question.content } }
    end

    assert_redirected_to question_url(Question.last)
  end

  test 'should show question' do
    get question_url(@question)
    assert_response :success
  end

  test 'should get edit' do
    get edit_question_url(@question)
    assert_response :success
  end

  test 'should update question' do
    patch question_url(@question), params: { question: { author: @question.author, content: @question.content } }
    assert_redirected_to question_url(@question)
  end

  test 'should destroy question' do
    assert_difference('Question.count', -1) do
      delete question_url(@question)
    end

    assert_redirected_to questions_url
  end
end
