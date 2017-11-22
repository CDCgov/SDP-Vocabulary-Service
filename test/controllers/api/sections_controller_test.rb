require 'test_helper'

class ApiSectionsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers
  include ActiveModelSerializers::Test::Schema
  include ActiveModelSerializers::Test::Serializer

  setup do
    @current_user = users(:admin)
    @section = sections(:one)
    sign_in @current_user
  end

  test 'api should get index' do
    get api_sections_url
    res = JSON.parse response.body
    current_user_id = @current_user ? @current_user.id : -1
    assert_equal Section.where("(status='published' OR created_by_id= ?)", current_user_id).count, res.count
    assert_response :success
    assert_response_schema('sections/show.json')
  end

  test 'api should show section' do
    get api_section_url(@section.version_independent_id)
    res = JSON.parse response.body
    tags = res['tags']
    assert_response :success
    assert_serializer 'SectionSerializer'
    assert_response_schema('sections/show.json')
    assert_equal 2, tags.length
    assert_equal 'Generic', tags[0]['code']
    assert_equal 'Generic', tags[1]['code']
    assert ['MMG', 'MMG Tab'], (tags.collect { |t| t['code'] })
  end

  test 'api should show section of specific version' do
    get api_section_url(@section.version_independent_id, version: 1)
    assert_response :success
    res = JSON.parse response.body
    assert_equal(res['version'], 1)
  end

  test 'api should 404 on section that doesnt exist' do
    get api_section_url(99)
    assert_response :not_found
    res = JSON.parse response.body
    assert_equal(res['message'], 'Resource Not Found')
  end

  test 'api should 404 on section version that doesnt exist' do
    get api_section_url(@section.version_independent_id, version: 99)
    assert_response :not_found
    res = JSON.parse response.body
    assert_equal(res['message'], 'Resource Not Found')
  end
end
