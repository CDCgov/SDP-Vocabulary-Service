module SDP
  class CommentsNotifier
    def self.notify_users(comment)
      notify_owner(comment)
      notify_of_reply(comment)
    end

    def self.notify_of_reply(comment)
      if comment.parent && comment.parent.user != comment.user
        message = "#{comment.user.full_name} replied to your comment"
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
      commentable = comment.commentable
      url = case commentable
            when Question
              "/#/questions/#{commentable.id}"
            when ResponseSet
              "/#/responseSets/#{commentable.id}"
            when Section
              "/#/Sections/#{commentable.id}"
            when Survey
              "/#/Surveys/#{commentable.id}"
            else
              ''
            end
      return "#{url}#comment_id_#{comment.id}" unless url.blank?
    end
  end
end
