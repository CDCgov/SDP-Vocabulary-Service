require 'test_helper'

class CategoriesControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @category = categories(:clinical)
    sign_in users(:admin)
  end

  test 'should get index' do
    get categories_url, xhr: true, params: nil
    assert_response :success
  end
end
