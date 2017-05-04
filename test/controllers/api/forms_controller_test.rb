require 'test_helper'

class FormsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers
  include ActiveModelSerializers::Test::Schema
  include ActiveModelSerializers::Test::Serializer

  setup do
    @form = forms(:one)
    sign_in users(:admin)
  end

  test 'api should get index' do
    get api_forms_url
    res = JSON.parse response.body
    assert_equal Form.latest_versions.count, res.count
    assert_response :success
    assert_response_schema('forms/show.json')
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

  test 'api should 404 on form that doesnt exist' do
    get api_form_url(99)
    assert_response :not_found
    res = JSON.parse response.body
    assert_equal(res['message'], 'Resource Not Found')
  end

  test 'api should 404 on form version that doesnt exist' do
    get api_form_url(@form.version_independent_id, version: 99)
    assert_response :not_found
    res = JSON.parse response.body
    assert_equal(res['message'], 'Resource Not Found')
  end
end
