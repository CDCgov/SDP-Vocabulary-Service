require 'test_helper'

class CommentTest < ActiveSupport::TestCase
  setup do
    @q = questions(:one)
    @u = users(:not_admin)
  end

  # Essentially testing that Versionable is working in Form
  test 'can add comments to a question ' do
    assert_difference('@q.comments.count') do
      @q.comments.create(comment: 'Is this a comment?', user: @u)
    end
  end

  test 'can create reply to comment ' do
    comment = @q.comments.create(comment: 'Is this a comment?', user: @u)
    reply   = comment.create_reply(@u, 'subject', 'Yeah, its a comment')
    reply.save!
    assert_equal reply.parent, comment, 'Should have associated the comment as its parent'
    assert_equal reply, comment.children[0]
  end
end
