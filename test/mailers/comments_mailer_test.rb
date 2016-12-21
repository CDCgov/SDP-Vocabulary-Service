require 'test_helper'

class CommentsMailerTest < ActionMailer::TestCase
  test 'notify owner' do
    owner = users(:admin)
    not_owner = users(:not_admin)
    question = questions(:one)
    comment = question.comments.create(comment: 'hey ', user: not_owner)
    email = CommentsMailer.notify_owner(comment)
    assert_emails 1 do
      email.deliver_now
    end
    assert_email(email, 'no-reply@vocabulary-services', owner, "#{not_owner.full_name} commented on your Question")
  end

  test 'notify reply ' do
    owner = users(:admin)
    not_owner = users(:not_admin)
    question = questions(:one)
    comment = question.comments.create(comment: 'hey ', user: not_owner)
    reply = comment.create_reply(owner, 'subject', 'Yeah, its a comment')
    email = CommentsMailer.notify_of_reply(reply)
    assert_emails 1 do
      email.deliver_now
    end
    assert_email(email, 'no-reply@vocabulary-services', not_owner, "#{owner.full_name} replyed to your comment")
  end

  private

  def assert_email(email, from, to, subject)
    # Test the body of the sent email contains what we expect it to
    assert_equal [from], email.from
    assert_equal [to.email], email.to
    assert_equal subject, email.subject
  end
end
