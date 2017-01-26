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
    res = JSON.parse response.body
    assert_equal(res.map { |r| r['id'] }, ['RS-1', 'RS-2'])
    assert_equal(res[1]['version'], 2) # index gets latest versions
    assert_response_schema('result_sets/show.json')
  end

  test 'api should show value set' do
    get api_valueSet_url(@response_set.version_independent_id)
    assert_response :success
    assert_serializer 'ValueSetsSerializer'
    assert_response_schema('result_sets/show.json')
  end

  test 'api should show value set of specific version' do
    get api_valueSet_url(@response_set.version_independent_id, version: 1)
    assert_response :success
    res = JSON.parse response.body
    assert_equal(res['version'], 1)
  end
end
