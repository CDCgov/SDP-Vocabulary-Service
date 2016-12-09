class CommentsMailer < ApplicationMailer
  def notify_commenters(comment)
  end

  def notify_owner(comment)
    subject "#{comment.user.full_name} Commented on your #{comment.commentable_type}"
  end

  private

  def gather_emails(comment)
    emails = []
    emails << comment.created_by.email
    comment.ancestors.each do |an|
      email = an.user.email
      emails << email unless email == comment.created_by.email
    end
    emails.uniq
  end
end
