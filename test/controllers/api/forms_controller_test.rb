require 'test_helper'

class FormsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @form = forms(:one)
    sign_in users(:admin)
  end

  test 'api should show form' do
    get api_form_url(@form)
    assert_response :success
  end
end
