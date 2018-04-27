class GroupSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :users
  has_many :users, serializer: UserSerializer
end
