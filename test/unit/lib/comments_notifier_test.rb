require 'test_helper'

require 'sdp/comments_notifier'

class CommentsNotifierTest < ActiveSupport::TestCase
  test 'notify owner' do
    owner = users(:admin)
    question  = questions(:one)
    not_owner = users(:not_admin)
    assert_difference('owner.notifications.count') do
      comment = question.comments.create(comment: 'hey ', user: not_owner)
      SDP::CommentsNotifier.notify_owner(comment)
      owner.reload
    end
  end

  test 'notify reply ' do
    owner = users(:admin)
    question  = questions(:one)
    not_owner = users(:not_admin)
    assert_difference('not_owner.notifications.count') do
      comment = question.comments.create(comment: 'hey ', user: not_owner)
      reply   = comment.create_reply(owner, 'subject', 'Yeah, its a comment')
      SDP::CommentsNotifier.notify_of_reply(reply)
      not_owner.reload
    end
  end
end
