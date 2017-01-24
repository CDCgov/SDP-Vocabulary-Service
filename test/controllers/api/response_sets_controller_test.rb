require 'test_helper'

class ResponseSetsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers
  include ActiveModelSerializers::Test::Schema
  include ActiveModelSerializers::Test::Serializer

  setup do
    @response_set = response_sets(:one)
    sign_in users(:admin)
  end

  test 'api should get index' do
    get api_valueSets_url
    assert_response :success
    assert_response_schema('result_sets/show.json')
  end

  test 'api should show value set' do
    get 'http://localhost:3000/api/valueSets/' + @response_set.version_independent_id
    assert_response :success
    assert_serializer 'ValueSetsSerializer'
    assert_response_schema('result_sets/show.json')
  end
end
