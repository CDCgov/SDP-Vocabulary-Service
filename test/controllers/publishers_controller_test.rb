require 'test_helper'

class PublishersControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @user = users(:publisher)
    sign_in users(:admin)
  end

  test 'should get index' do
    @user.add_role :publisher
    @user.save!
    get publishers_url
    assert_response :success
    json = JSON.parse(response.body)
    assert_equal User.with_role(:publisher).size, json.size
  end
end
