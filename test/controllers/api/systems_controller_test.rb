require 'test_helper'

class ApiSystemsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers
  include ActiveModelSerializers::Test::Schema
  include ActiveModelSerializers::Test::Serializer

  setup do
    @system = surveillance_systems(:nids)
    sign_in users(:admin)
  end

  test 'api should get index of systems' do
    get api_systems_url
    assert_response :success
    assert_response_schema('systems/show.json')
  end

  test 'api should show system' do
    get api_system_url(@system)
    assert_response :success
    assert_serializer 'SystemSerializer'
    assert_response_schema('systems/show.json')
  end

  test 'api should 404 on system that doesnt exist' do
    get api_system_url(99)
    assert_response :not_found
    res = JSON.parse response.body
    assert_equal(res['message'], 'Resource Not Found')
  end
end
