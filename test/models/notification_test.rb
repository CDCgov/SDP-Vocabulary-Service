require 'test_helper'

class NotificationTest < ActiveSupport::TestCase
  setup do
    @admin = users(:admin)
    @notadmin = users(:not_admin)
  end

  test 'can create notification' do
    note = Notification.new(user: @admin, message: 'hey its a message', url: '/questions/1/#comment_id_3')
    assert note.save
    assert !note.read, 'new notification should not be marked as read'
  end

  test 'validates fields' do
    note = Notification.new
    assert_equal false, note.save
    errors = note.errors.full_messages
    assert errors.index("User can't be blank")
    assert errors.index("Message can't be blank")
    assert errors.index("Url can't be blank")
  end

  test 'can delete notification' do
    note = Notification.first
    assert_difference('Notification.count', -1) do
      note.destroy
    end
  end

  test 'can mark notification as read' do
    note = Notification.unread.first
    note.read = true
    assert note.save
  end

  test 'cannot update user message or url fields ' do
    note = @admin.notifications.first
    note.user = @not_admin
    note.message = "#{note.message} updated!!!!!"
    note.url = "#{note.url}/"
    note.save
    errors = note.errors.full_messages
    assert_not_equal 0, errors.length
    assert errors.index('User change not allowed!')
    assert errors.index('Url change not allowed!')
    assert errors.index('Message change not allowed!')
  end

  test 'can get users unread notifications ' do
    notes = @admin.notifications.unread
    notes.each do |note|
      assert_equal false, note.read
    end
  end

  test 'can get user read notifications ' do
    notes = @admin.notifications.read
    notes.each do |note|
      assert_equal true, note.read
    end
  end
end
