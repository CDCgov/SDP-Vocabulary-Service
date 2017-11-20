include ActiveModel::Serialization

class UserSerializer < ActiveModel::Serializer
  attribute :id
  attribute :email
  attribute :full_name, key: :name
  attribute :first_name
  attribute :last_name
  attribute :last_program_id
  attribute :last_system_id
  attribute :publisher?, key: :publisher
  attribute :admin?, key: :admin
  has_many :groups, serializer: GroupSerializer
end
