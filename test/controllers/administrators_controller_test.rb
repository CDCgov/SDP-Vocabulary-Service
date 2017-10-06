require 'test_helper'

class AdministratorsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @user = users(:publisher)
    @user.add_role :admin
    @user.save!
    @admin = users(:admin)
    @admin.add_role :admin
    @admin.save!
    sign_in users(:admin)
  end

  test 'should get index' do
    get administrators_url
    assert_response :success
    json = JSON.parse(response.body)
    assert_equal User.with_role(:admin).size, json.size
  end
end
