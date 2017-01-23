require 'test_helper'

require 'sdp/comments_notifier'

class CommentsNotifierTest < ActiveSupport::TestCase
  test 'notify owner' do
    owner = users(:admin)
    not_owner = users(:not_admin)
    question = questions(:one)
    notification_count = owner.notifications.count
    comment = question.comments.create(comment: 'hey ', user: not_owner)
    SDP::CommentsNotifier.notify_owner(comment)
    owner.reload
    assert_equal notification_count + 1, owner.notifications.count
  end

  test 'notify reply ' do
    owner = users(:admin)
    not_owner = users(:not_admin)
    question = questions(:one)
    notification_count = not_owner.notifications.count
    comment = question.comments.create(comment: 'hey ', user: not_owner)
    reply = comment.create_reply(owner, 'subject', 'Yeah, its a comment')
    SDP::CommentsNotifier.notify_of_reply(reply)
    not_owner.reload
    assert_equal notification_count + 1, not_owner.notifications.count
  end
end
