include ActiveModel::Serialization

class QuestionsSerializer < ActiveModel::Serializer
  attribute :version_independent_id, key: :questionId
  attribute :content, key: :questionText
  attribute :questionUri do
    Rails.application.routes.url_helpers.api_question_url(object.version_independent_id, version: object.version, only_path: true)
  end
  attribute :version, key: :version
  attribute :published_by, serializer: UserSerializer
  attribute :questionType do
    object.question_type.name if object.question_type
  end
  attribute :responseType do
    object.response_type.name if object.response_type
  end
end
