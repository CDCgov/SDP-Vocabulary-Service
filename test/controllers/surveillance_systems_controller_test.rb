require 'test_helper'

class SurveillanceSystemsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  test 'should get index' do
    get surveillance_systems_url
    assert_response :success
  end

  test 'should not be allowed to create system' do
    post surveillance_systems_url, params: { name: 'test sys' }
    assert_response :forbidden
  end

  test 'should be allowed to create system' do
    @admin = users(:admin)
    @admin.add_role :admin
    @admin.save!
    sign_in @admin
    post surveillance_systems_url, params: { name: 'test sys' }
    assert_response :success
  end
end
