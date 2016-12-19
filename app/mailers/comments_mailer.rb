class CommentsMailer < ApplicationMailer
  def notify_of_reply(comment)
    if comment.parent && comment.parent.user != comment.user
      subject = "#{comment.user.full_name} replyed to your comment"
      body = commentable_url(comment)
      mail(to: comment.parent.user.email, subject: subject, body: body)
    end
  end

  def notify_owner(comment)
    if comment.commentable.created_by != comment.user
      subject = "#{comment.user.full_name} commented on your #{comment.commentable_type}"
      body = commentable_url(comment)
      mail(to: comment.commentable.created_by.email, subject: subject, body: body)
    end
  end

  private

  def commentable_url(comment)
    commentable = comment.commentable
    url = case commentable
          when Question
            question_url(commentable)
          when ResponseSet
            question_url(commentable)
          when Form
            question_url(commentable)
          else
            ''
          end
    return "#{url}#comment_id_#{comment.id}" unless url.blank?
  end

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
