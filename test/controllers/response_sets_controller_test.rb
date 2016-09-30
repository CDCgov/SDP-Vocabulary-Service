require 'test_helper'

class ResponseSetsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @response_set = response_sets(:one)
  end

  test "should get index" do
    get response_sets_url
    assert_response :success
  end

  test "should get new" do
    get new_response_set_url
    assert_response :success
  end

  test "should create response_set" do
    assert_difference('ResponseSet.count') do
      post response_sets_url, params: { response_set: { author: @response_set.author, code: @response_set.code, code_system: @response_set.code_system, description: @response_set.description, name: @response_set.name, oid: @response_set.oid } }
    end

    assert_redirected_to response_set_url(ResponseSet.last)
  end

  test "should show response_set" do
    get response_set_url(@response_set)
    assert_response :success
  end

  test "should get edit" do
    get edit_response_set_url(@response_set)
    assert_response :success
  end

  test "should update response_set" do
    patch response_set_url(@response_set), params: { response_set: { author: @response_set.author, code: @response_set.code, code_system: @response_set.code_system, description: @response_set.description, name: @response_set.name, oid: @response_set.oid } }
    assert_redirected_to response_set_url(@response_set)
  end

  test "should destroy response_set" do
    assert_difference('ResponseSet.count', -1) do
      delete response_set_url(@response_set)
    end

    assert_redirected_to response_sets_url
  end
end
