require 'test_helper'

class ProgramsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers
  include ActiveModelSerializers::Test::Schema
  include ActiveModelSerializers::Test::Serializer

  setup do
    @program = surveillance_programs(:generic)
    sign_in users(:admin)
  end

  test 'api should get index of programs' do
    get api_programs_url
    assert_response :success
    assert_response_schema('programs/show.json')
  end

  test 'api should show program' do
    get api_program_url(@program)
    assert_response :success
    assert_serializer 'ProgramSerializer'
    assert_response_schema('programs/show.json')
  end

  test 'api should 404 on program that doesnt exist' do
    get api_program_url(99)
    assert_response :not_found
    res = JSON.parse response.body
    assert_equal(res['message'], 'Resource Not Found')
  end
end
