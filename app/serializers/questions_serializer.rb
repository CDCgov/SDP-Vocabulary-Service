include ActiveModel::Serialization

class QuestionsSerializer < ActiveModel::Serializer
  attribute :version_independent_id, key: :questionId
  attribute :content, key: :questionText
  attribute :questionUri do
    Rails.application.routes.url_helpers.api_question_url(object.version_independent_id, version: object.version, only_path: true)
  end
  attribute :version, key: :version
  attribute :published_by, serializer: UserSerializer
  attribute :category do
    object.category.name if object.category
  end
  attribute :subcategory do
    object.subcategory.name if object.subcategory
  end
  attribute :responseType do
    object.response_type.name if object.response_type
  end
  # To ensure backwards compatibility in release 1.12 tags logic is still
  # a combination of both single word tags and code mappings
  attribute(:tags) { codes }
  attribute :tag_list, key: :singleWordTags
  attribute :codeSystemMappings do
    object.concepts.collect { |c| CodeSerializer.new(c).as_json }
  end

  def codes
    object.concepts.collect { |c| CodeSerializer.new(c).as_json } + object.tag_list.map { |tag| {'displayName': tag, 'code': '', 'codeSystem': ''}}
  end
end
