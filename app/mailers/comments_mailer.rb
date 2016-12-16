class CommentsMailer < ApplicationMailer
  def notify_of_reply(comment)
    if comment.parent && comment.parent.user != comment.user
      subject = "#{comment.user.full_name} replyed to your comment"
      mail(to: comment.parent.user.email, subject: subject, body: '')
    end
  end

  def notify_owner(comment)
    if comment.commentable.created_by != comment.user
      subject = "#{comment.user.full_name} commented on your #{comment.commentable_type}"
      mail(to: comment.commentable.created_by.email, subject: subject, body: '')
    end
  end

  private

  def gather_commenter_emails(comment)
    emails = []
    owner = comment.commentable.created_by
    comment.commentable.comments.each do |an|
      if an.user != owner || an.user != comment.user
        emails << comment.user.email
      end
    end
    emails.uniq
  end
end
