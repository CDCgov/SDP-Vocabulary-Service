require 'test_helper'

class SurveillanceProgramsControllerTest < ActionDispatch::IntegrationTest
  test 'should get index' do
    get surveillance_programs_url
    assert_response :success
  end
end
