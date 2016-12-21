require 'test_helper'

class CommentTest < ActiveSupport::TestCase
  # Essentially testing that Versionable is working in Form
  test 'can add comments to a question ' do
    q = questions(:one)
    u = users(:not_admin)
    assert_equal 0, q.comments.count, 'Should contain 0 comments '
    q.comments.create(comment: 'Is this a comment?', user: u)
    assert_equal 1, q.comments.count, 'SHould have created a single comment'
  end

  test 'can create reply to comment ' do
    q = questions(:one)
    u = users(:not_admin)
    comment = q.comments.create(comment: 'Is this a comment?', user: u)
    reply = comment.create_reply(u, 'subject', 'Yeah, its a comment')
    reply.save!
    assert_equal reply.parent, comment, 'Should have associated the comment as its parent'
    assert_equal reply, comment.children[0]
  end
end
