class SectionSerializer < ActiveModel::Serializer
  attribute(:programId) { nil }
  attribute(:programName) { nil }
  attribute(:programUri) { nil }
  attribute :version_independent_id, key: :sectionId
  attribute :name, key: :sectionName
  attribute :sectionUri do
    Rails.application.routes.url_helpers.api_section_url(object.version_independent_id, version: object.version, only_path: true)
  end
  attribute :version
  attribute :published_by, serializer: UserSerializer
  # To ensure backwards compatibility in release 1.12 tags logic is still
  # a combination of both single word tags and code mappings
  attribute(:tags) { codes }
  attribute :tag_list, key: :singleWordTags
  attribute :codeSystemMappings do
    object.concepts.collect { |c| CodeSerializer.new(c).as_json }
  end
  has_many :section_nested_items, key: :nested_items, serializer: SectionNestedItemsSerializer
  def codes
    object.concepts.collect { |c| CodeSerializer.new(c).as_json } + object.tag_list.map { |tag| {'displayName': tag, 'code': '', 'codeSystem': ''}}
  end
end
