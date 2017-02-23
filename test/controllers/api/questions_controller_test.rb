require 'test_helper'

class QuestionsControllerTest < ActionDispatch::IntegrationTest
  include ActiveModelSerializers::Test::Schema
  include ActiveModelSerializers::Test::Serializer

  setup do
    @question = questions(:one)
    sign_in users(:admin)
  end

  test 'api should get index' do
    get api_questions_url
    res = JSON.parse response.body
    assert_equal(res.map { |r| r['questionId'] }, ['Q-1', 'Q-2', 'Q-3'])
    assert_equal(res[2]['version'], 2) # index gets latest versions
    assert_response :success
    assert_response_schema('questions/show.json')
  end

  test 'api should show question' do
    get api_question_url(@question.version_independent_id)
    assert_response :success
    assert_serializer 'QuestionsSerializer'
    assert_response_schema('questions/show.json')
  end

  test 'api should show question of specific version' do
    get api_question_url(@question.version_independent_id, version: 1)
    assert_response :success
    res = JSON.parse response.body
    assert_equal(res['version'], 1)
  end

  test 'api should 404 on question that doesnt exist' do
    get api_question_url(@question.version_independent_id, version: 99)
    assert_response :not_found
    res = JSON.parse response.body
    assert_equal(res['message'], 'Resource Not Found')
  end
end
