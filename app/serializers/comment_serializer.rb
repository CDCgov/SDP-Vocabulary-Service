class CommentSerializer < ActiveModel::Serializer
  attribute :id
  attribute :parent_id
  attribute :title
  attribute :comment
  attribute :user_id
  attribute :created_at
  attribute :role
  attribute :user_name, key: :user_name
  attribute :children, key: :children

  def user_name
    object.user.full_name
  end

  has_many :children, serializer: CommentSerializer
end
