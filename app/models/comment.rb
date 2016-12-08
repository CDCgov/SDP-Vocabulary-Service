class Comment < ActiveRecord::Base
  include ActsAsCommentable::Comment
  acts_as_tree

  belongs_to :commentable, polymorphic: true

  default_scope -> { order('created_at ASC') }

  # NOTE: install the acts_as_votable plugin if you
  # want user to vote on the quality of comments.
  # acts_as_voteable

  # NOTE: Comments belong to a user
  belongs_to :user
  scope :top_level, -> { where(parent_id: nil) }

  def create_reply(from, subject, message)
    Comment.new(comment: message, user: from, title: subject, parent: self, commentable: commentable)
  end
end
