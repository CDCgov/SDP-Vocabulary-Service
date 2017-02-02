require 'test_helper'

class ResponseTypesControllerTest < ActionDispatch::IntegrationTest
  test 'should get index' do
    get response_types_url
    assert_response :success
  end
end
