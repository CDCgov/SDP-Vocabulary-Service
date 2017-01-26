require 'test_helper'

class FormsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers
  include ActiveModelSerializers::Test::Schema
  include ActiveModelSerializers::Test::Serializer

  setup do
    @form = forms(:one)
    sign_in users(:admin)
  end

  test 'api should show form' do
    get api_form_url(@form.version_independent_id)
    assert_response :success
    assert_serializer 'FormSerializer'
    assert_response_schema('forms/show.json')
  end

  test 'api should show form of specific version' do
    get api_form_url(@form.version_independent_id, version: 1)
    assert_response :success
    res = JSON.parse response.body
    assert_equal(res['version'], 1)
  end
end
