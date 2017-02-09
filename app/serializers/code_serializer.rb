include ActiveModel::Serialization

class CodeSerializer < ActiveModel::Serializer
  attribute :value, key: 'code'
  attribute :code_system, key: 'codeSystem'
  attribute :display_name, key: 'displayName'
end
