include ActiveModel::Serialization

class UsageSerializer < ActiveModel::Serializer
  attribute(:programId) { nil }
  attribute(:programName) { nil }
  attribute(:programUri) { nil }
  has_many :forms, serializer: FormSerializer
end
