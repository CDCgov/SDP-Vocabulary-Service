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

  test 'should create question' do
    assert_difference('Question.count') do
      post questions_url, params: { question: { content: @question.content, question_type_id: @question.question_type.id } }
    end

    assert_redirected_to question_url(Question.last)
  end

  test 'should destroy question' do
    assert_difference('Question.count', -1) do
      delete question_url(@question)
    end
    assert_response :success
  end
end
