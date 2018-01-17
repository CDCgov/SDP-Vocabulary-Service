require 'test_helper'

class ApiFhirValueSetsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers
  include ActiveModelSerializers::Test::Schema
  include ActiveModelSerializers::Test::Serializer

  setup do
    @current_user = users(:admin)
    @response_set = response_sets(:one)
    sign_in @current_user
  end

  test 'api should get index' do
    get api_fhir_valuesets_url
    assert_response :success
    res = JSON.parse response.body
    assert_equal ResponseSet.where("status='published'").count, res.count
    assert_json_schema('fhir/Bundle.schema.json', res)
  end

  test 'api should show value set' do
    get api_fhir_valueset_url(@response_set.version_independent_id)
    assert_response :success
    assert_json_schema_response('fhir/ValueSet.schema.json')
  end

  test 'api value set should have the correct url' do
    get api_fhir_valueset_url(@response_set.version_independent_id)
    assert_response :success
    res = JSON.parse response.body
    assert_equal api_fhir_valueset_version_url(@response_set.version_independent_id, @response_set.version), res['url']
  end

  test 'api should show value set of specific version' do
    get api_fhir_valueset_url(@response_set.version_independent_id, version: 1)
    assert_response :success
    res = JSON.parse response.body
    assert_equal(res['version'], '1')
    assert_json_schema('fhir/ValueSet.schema.json', res)
  end

  test 'api should 404 on value set that doesnt exist' do
    get api_fhir_valueset_url(99)
    assert_response :not_found
    res = JSON.parse response.body
    assert_equal(res['message'], 'Resource Not Found')
  end

  test 'api should 404 on value set version that doesnt exist' do
    get api_fhir_valueset_url(@response_set.version_independent_id, version: 99)
    assert_response :not_found
    res = JSON.parse response.body
    assert_equal(res['message'], 'Resource Not Found')
  end
end
