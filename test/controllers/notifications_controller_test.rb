require 'test_helper'

class NotificationsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  test 'can get users notifications' do
    admin = users(:admin)
    sign_in(admin)
    get notifications_path
    assert_response :success
    json = ActiveSupport::JSON.decode @response.body
    assert_equal admin.notifications.length, json.length
  end

  test 'retuns empty arry when user not logged in' do
    get notifications_path
    assert_response :success
    json = ActiveSupport::JSON.decode @response.body
    assert_equal 0, json.length
  end

  test 'can mark notifications as read ' do
    admin = users(:admin)
    sign_in(admin)
    assert_not_equal admin.notifications.unread.count, admin.notifications.count
    post notifications_mark_read_path, params: { ids: [admin.notifications.collect(&:id)] }
    admin.reload
    assert_equal 0, admin.notifications.unread.count
  end
end
