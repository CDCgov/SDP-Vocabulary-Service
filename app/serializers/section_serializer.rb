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
  attribute(:tags) { codes }
  has_many :section_questions, key: :questions, serializer: SectionQuestionsSerializer
  def codes
    object.concepts.collect { |c| CodeSerializer.new(c).as_json }
  end
end
