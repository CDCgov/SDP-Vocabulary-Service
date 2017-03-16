require 'test_helper'

class SurveillanceSystemsControllerTest < ActionDispatch::IntegrationTest
  test 'should get index' do
    get surveillance_systems_url
    assert_response :success
  end
end
