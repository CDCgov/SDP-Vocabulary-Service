require 'test_helper'

class SurveillanceProgramsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  test 'should get index' do
    get surveillance_programs_url
    assert_response :success
  end

  test 'should not be allowed to create program' do
    post surveillance_programs_url, params: { name: 'test prog' }
    assert_response :forbidden
  end

  test 'should be allowed to create program' do
    @admin = users(:admin)
    @admin.add_role :admin
    @admin.save!
    sign_in @admin
    post surveillance_programs_url, params: { name: 'test prog' }
    assert_response :success
  end
end
