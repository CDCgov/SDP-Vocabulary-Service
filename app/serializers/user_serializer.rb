include ActiveModel::Serialization

class UserSerializer < ActiveModel::Serializer
  attribute :id
  attribute :email
  attribute :full_name, key: :name
end
