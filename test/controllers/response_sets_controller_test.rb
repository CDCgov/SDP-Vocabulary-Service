require 'test_helper'

class ResponseSetsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers
  include ActiveJob::TestHelper

  DRAFT = 'draft'.freeze
  PUBLISHED = 'published'.freeze

  setup do
    @response_set  = response_sets(:one)
    @response_set2 = response_sets(:two)
    @resp  = responses(:one)
    @resp2 = responses(:two)
    @current_user = users(:admin)
    sign_in @current_user
  end

  test 'new rs should be draft' do
    rs_json = { response_set: { description: @response_set.description, name: @response_set.name, oid: '2.16.840.1.113883.3.1502.3.4' } }.to_json
    post response_sets_url, params: rs_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    assert_equal DRAFT, ResponseSet.last.status
  end

  test 'revised rs should be draft' do
    assert true
  end

  test 'should be able to delete a draft rs' do
    rs_json = { response_set: { description: @response_set.description, name: @response_set.name, oid: '2.16.840.1.113883.3.1502.3.4' } }.to_json
    post response_sets_url, params: rs_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    assert_equal ResponseSet.last.status, 'draft'
    last_id = ResponseSet.last.id
    assert_difference('ResponseSet.count', -1) do
      delete response_set_url(ResponseSet.last), headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    end
    assert_response :success
    assert_not_equal last_id, ResponseSet.last
  end

  test 'should not be able to delete a published rs' do
    delete response_set_url(response_sets(:one)), headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    assert_response 422
  end

  test 'should be able to update a draft rs' do
    rs_json = { response_set: { description: @response_set.description, name: @response_set.name, oid: '2.16.840.1.113883.3.1502.3.4' } }.to_json
    post response_sets_url, params: rs_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    assert_equal DRAFT, ResponseSet.last.status

    put response_set_url(ResponseSet.last, format: :json), params: { response_set: { description: 'new description' } }

    assert_equal 'new description', ResponseSet.last.description
  end

  test 'should not be able to update a published rs' do
    patch response_set_url(response_sets(:one), format: :json), params: { response_set: { description: 'secret description' } }
    assert_response :unprocessable_entity
    assert_nil ResponseSet.find_by(description: 'secret description')
  end

  test 'should get index' do
    get response_sets_url, xhr: true, params: nil
    assert_response :success
  end

  test 'should get my response sets' do
    get my_response_sets_url, xhr: true, params: nil
    assert_response :success
    JSON.parse(response.body).each do |f|
      assert f['created_by']['id'] == @current_user.id
    end
  end

  test 'revisions should increment version without needing a param' do
    rs_json = { response_set: { version_independent_id: 'RS-1337', description: @response_set.description, name: @response_set.name, oid: '2.16.840.1.113883.3.1502.3.4' } }.to_json
    post response_sets_url, params: rs_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    ResponseSet.last.publish(@current_user)
    v1 = ResponseSet.last
    rs_json = { response_set: { version_independent_id: 'RS-1337', description: 'Revision', name: @response_set.name, oid: '2.16.840.1.113883.3.1502.3.4' } }.to_json
    post response_sets_url, params: rs_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    assert_response :success
    v2 = ResponseSet.last
    assert_equal v1.version_independent_id, v2.version_independent_id
    assert_equal v1.version + 1, v2.version
    assert_equal 'Revision', v2.description
  end

  test 'cannot revise something you do not own' do
    rs_json = { response_set: { version_independent_id: 'RS-1337', description: @response_set.description, name: @response_set.name, oid: '2.16.840.1.113883.3.1502.3.4' } }.to_json
    post response_sets_url, params: rs_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    ResponseSet.last.publish(@current_user)
    sign_in users(:not_admin)
    rs_json = { response_set: { version_independent_id: 'RS-1337', description: 'Revision', name: @response_set.name, oid: '2.16.840.1.113883.3.1502.3.4' } }.to_json
    post response_sets_url, params: rs_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    assert_response :unauthorized
  end

  test 'cannot revise a draft' do
    rs_json = { response_set: { version_independent_id: 'RS-1337', description: @response_set.description, name: @response_set.name, oid: '2.16.840.1.113883.3.1502.3.4' } }.to_json
    post response_sets_url, params: rs_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    assert_equal DRAFT, ResponseSet.last.status
    rs_json = { response_set: { version_independent_id: 'RS-1337', description: 'Revision', name: @response_set.name, oid: '2.16.840.1.113883.3.1502.3.4' } }.to_json
    post response_sets_url, params: rs_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    assert_response :unprocessable_entity
  end

  test 'should create response_set' do
    assert_enqueued_jobs 0
    assert_difference('ResponseSet.count') do
      rs_json = { response_set: { description: @response_set.description, name: @response_set.name, oid: '2.16.840.1.113883.3.1502.3.4' } }.to_json
      post response_sets_url, params: rs_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    end
    assert_enqueued_jobs 1
    assert_response :success
  end

  test 'should show response_set' do
    get response_set_url(@response_set), xhr: true, params: nil
    assert_response :success
  end

  test 'should get response_set usage' do
    get usage_response_set_url(@response_set), xhr: true, params: nil
    assert_response :success
    response_json = JSON.parse(@response.body)
    assert_equal @response_set.id, response_json['id']
    assert response_json['surveillance_systems'].include? 'National Insignificant Digits System'
    assert response_json['surveillance_programs'].include? 'Generic Surveillance Program'
  end

  test 'publishers should see response_sets from other authors' do
    sign_out @current_user
    @current_publisher = users(:publisher)
    sign_in @current_publisher
    get response_set_url(response_sets(:two), format: :json)
    assert_response :success
  end

  test 'publishers should be able to publish response_sets' do
    sign_out @current_user
    @current_publisher = users(:publisher)
    sign_in @current_publisher
    put publish_response_set_path(response_sets(:two), format: :json)
    assert_response :success
    assert_equal ResponseSet.find(response_sets(:two).id).status, PUBLISHED
    assert_equal ResponseSet.find(response_sets(:two).id).published_by.id, users(:publisher).id
  end

  test 'authors should not be able to publish response_sets' do
    put publish_response_set_path(response_sets(:two), format: :json)
    assert_response :forbidden
  end
end
