require 'test_helper'

class SystemsControllerTest < ActionDispatch::IntegrationTest
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
end
