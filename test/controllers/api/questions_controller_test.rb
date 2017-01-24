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
    assert_response :success
    assert_response_schema('questions/show.json')
  end

  test 'api should show question' do
    get 'http://localhost:3000/api/questions/' + @question.version_independent_id
    assert_response :success
    assert_serializer 'QuestionsSerializer'
    assert_response_schema('questions/show.json')
  end
end
