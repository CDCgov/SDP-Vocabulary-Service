require 'test_helper'

class ResponsesControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @response_set = response_sets(:one)
    @resp = responses(:one)
    sign_in users(:admin)
  end

  test 'should get index' do
    get responses_url
    assert_response :success
  end

  test 'should get new' do
    get new_response_url
    assert_response :success
  end

  test 'should create response' do
    assert_difference('Response.count') do
      post responses_url, params: { response: { response_set_id: @response_set.id, value: 'one' } }
    end

    assert_redirected_to response_url(Response.last)
  end

  test 'should show response' do
    get response_url(@resp)
    assert_response :success
  end

  test 'should get edit' do
    get edit_response_url(@resp)
    assert_response :success
  end

  test 'should update response' do
    patch response_url(@resp), params: { response: { response_set_id: @response_set.id, value: 'one' } }
    assert_redirected_to response_url(@resp)
  end

  test 'should destroy response' do
    assert_difference('Response.count', -1) do
      delete response_url(@resp)
    end
    assert_redirected_to(responses_url)
  end
end
