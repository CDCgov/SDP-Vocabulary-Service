require 'test_helper'

class ApiFhirSectionsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers
  include ActiveModelSerializers::Test::Schema
  include ActiveModelSerializers::Test::Serializer

  setup do
    @current_user = users(:admin)
    @section = sections(:one)
    sign_in @current_user
  end

  test 'api should get index' do
    get api_fhir_sections_url
    res = JSON.parse response.body
    count = Section.where("status='published'").count
    assert_equal count, res['entry'].count, "Expected #{count} to equal #{res.count}"
    assert_response :success
    assert_json_schema('fhir/Bundle.schema.json', res)
  end

  test 'api should show section' do
    get api_fhir_section_url(@section.version_independent_id)
    assert_response :success
    assert_json_schema_response('fhir/Questionnaire.json')
  end

  test 'api should show section of specific version' do
    get api_fhir_section_version_url(@section.version_independent_id, version: 1)
    assert_response :success
    assert_json_schema_response('fhir/Questionnaire.json')
  end

  test 'api should 404 on section that doesnt exist' do
    get api_fhir_section_url(99)
    assert_response :not_found
  end

  test 'api should 404 on section version that doesnt exist' do
    get api_fhir_section_version_url(@section.version_independent_id, version: 99)
    assert_response :not_found
  end
end
