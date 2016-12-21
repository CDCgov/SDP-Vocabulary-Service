class CommentSerializer < ActiveModel::Serializer
  attribute :id
  attribute :parent_id, key: :parentId
  attribute :title
  attribute :comment
  attribute :commentable_id, key: :commentableId
  attribute :commentable_type, key: :commentableType
  attribute :user_id, key: :userId
  attribute :created_at, key: :createdAt
  attribute :role
  attribute :user_name, key: :userName
  # attribute :children, key: :children

  def user_name
    object.user.full_name
  end

  # has_many :children, serializer: CommentSerializer
end
