require 'test_helper'

class ResponseSetsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers
  setup do
    @response_set = response_sets(:one)
    sign_in users(:admin)
  end

	test 'api should get index' do
    get api_valueSets_url
    assert_response :success
  end

	test 'api should show value set' do
		get api_valueSets_url(@response_set)
		assert_response :success
	end

end