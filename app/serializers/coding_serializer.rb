include ActiveModel::Serialization

class CodingSerializer < ActiveModel::Serializer
  attribute :value, key: 'code'
  attribute :code_system, key: 'system'
  attribute :display_name, key: 'display'
end
