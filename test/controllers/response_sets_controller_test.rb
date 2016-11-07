require 'test_helper'

class ResponseSetsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers
  setup do
    @response_set = response_sets(:one)
    @response_set2 = response_sets(:two)
    @resp = responses(:one)
    @resp2 = responses(:two)
    sign_in users(:admin)
  end

  test 'should get index' do
    get response_sets_url
    assert_response :success
  end

  test 'should get new' do
    get new_response_set_url
    assert_response :success
  end

  test 'should create response_set' do
    assert_difference('ResponseSet.count') do
      post response_sets_url, params: { response_set: { description: @response_set.description, name: @response_set.name, oid: @response_set.oid } }
    end

    assert_redirected_to response_set_url(ResponseSet.last)
  end

  test 'should show response_set' do
    get response_set_url(@response_set)
    assert_response :success
  end

  test 'should get edit' do
    get edit_response_set_url(@response_set)
    assert_response :success
  end

  test 'should get extend' do
    get extend_response_set_url(@response_set)
    assert_response :success
  end

  test 'should update response_set' do
    patch response_set_url(@response_set), params: { response_set: { description: @response_set.description, name: @response_set.name, oid: @response_set.oid } }
    assert_redirected_to response_set_url(@response_set)
  end

  test 'should destroy response_set' do
    assert_difference('ResponseSet.count', -1) do
      patch response_url(@resp), params: { response: { response_set_id: @response_set2.id, value: 'one' } }
      patch response_url(@resp2), params: { response: { response_set_id: @response_set2.id, value: 'two' } }
      delete response_set_url(@response_set)
    end

    assert_redirected_to response_sets_url
  end
end
