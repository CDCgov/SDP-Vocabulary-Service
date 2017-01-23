module SDP
  class CommentsNotifier
    def self.notify_users(comment)
      notify_owner(comment)
      notify_of_reply(comment)
    end

    def self.notify_of_reply(comment)
      if comment.parent && comment.parent.user != comment.user
        message = "#{comment.user.full_name} replyed to your comment"
        url = commentable_url(comment)
        Notification.create(user: comment.parent.user,
                            message: message, url: url)
      end
    end

    def self.notify_owner(comment)
      if comment.commentable.created_by != comment.user
        message = "#{comment.user.full_name} commented on your #{comment.commentable_type}"
        url = commentable_url(comment)
        Notification.create(user: comment.commentable.created_by,
                            message: message, url: url)
      end
    end

    def self.commentable_url(comment)
      url_helper = Rails.application.routes.url_helpers
      commentable = comment.commentable
      url = case commentable
            when Question
              url_helper.question_url(commentable)
            when ResponseSet
              url_helper.response_set_url(commentable)
            when Form
              url_helper.form_url(commentable)
            else
              ''
            end
      return "#{url}#comment_id_#{comment.id}" unless url.blank?
    end
  end
end
