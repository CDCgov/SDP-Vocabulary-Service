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

  test 'should be able to publish a draft rs' do
    rs_json = { response_set: { description: @response_set.description, name: @response_set.name, oid: '2.16.840.1.113883.3.1502.3.4' } }.to_json
    post response_sets_url, params: rs_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    ResponseSet.last.publish
    assert_equal PUBLISHED, ResponseSet.last.status
  end

  test 'should be able to delete a draft rs' do
    assert true
  end

  test 'should not be able to delete a published rs' do
    assert true
  end

  test 'should be able to update a draft rs' do
    assert true
  end

  test 'should not be able to update a published rs' do
    assert true
  end

  test 'should get index' do
    get response_sets_url, xhr: true, params: nil
    assert_response :success
  end

  test 'should get my response sets' do
    get my_response_sets_url, xhr: true, params: nil
    assert_response :success
    JSON.parse(response.body).each do |f|
      assert f['created_by_id'] == @current_user.id
    end
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

  test 'should destroy response_set' do
    assert_enqueued_jobs 0
    assert_difference('ResponseSet.count', -1) do
      patch response_url(@resp),  params: { response: { response_set_id: @response_set2.id, value: 'one' } }
      patch response_url(@resp2), params: { response: { response_set_id: @response_set2.id, value: 'two' } }
      delete response_set_url(@response_set)
    end
    assert_enqueued_jobs 1
    assert_redirected_to response_sets_url
  end
end
