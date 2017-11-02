require 'test_helper'

class QuestionTypesControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @question_type = question_types(:one)
    sign_in users(:admin)
  end

  test 'should get index' do
    get question_types_url, xhr: true, params: nil
    assert_response :success
  end
end
