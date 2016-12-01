require 'test_helper'

class QuestionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @question = questions(:one)
    sign_in users(:admin)
  end

  test 'api should get index' do
    get api_questions_url
    assert_response :success
  end

  test 'api should show question' do
    get api_questions_url(@question)
    assert_response :success
  end
end
