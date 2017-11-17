require 'test_helper'

class ApiQuestionsControllerTest < ActionDispatch::IntegrationTest
  include ActiveModelSerializers::Test::Schema
  include ActiveModelSerializers::Test::Serializer
  include Devise::Test::IntegrationHelpers

  setup do
    @current_user = users(:admin)
    @question = questions(:one)
    sign_in @current_user
  end

  test 'api should get index' do
    get api_questions_url
    res = JSON.parse response.body
    current_user_id = @current_user ? @current_user.id : -1
    assert_equal Question.where("(status='published' OR created_by_id= ?)", current_user_id).count, res.count
    assert_response :success
    assert_json_schema_response('questions/show.json')
  end

  test 'api should show question' do
    get api_question_url(@question.version_independent_id)
    assert_response :success
    assert_serializer 'QuestionsSerializer'
    assert_json_schema_response('questions/show.json')
  end

  test 'api should show question of specific version' do
    get api_question_url(@question.version_independent_id, version: 1)
    assert_response :success
    res = JSON.parse response.body
    assert_equal(res['version'], 1)
  end

  test 'api should 404 on question that doesnt exist' do
    get api_question_url(99)
    assert_response :not_found
    res = JSON.parse response.body
    assert_equal(res['message'], 'Resource Not Found')
  end

  test 'api should 404 on question version that doesnt exist' do
    get api_question_url(@question.version_independent_id, version: 99)
    assert_response :not_found
    res = JSON.parse response.body
    assert_equal(res['message'], 'Resource Not Found')
  end
end
