include ActiveModel::Serialization

class QuestionsSerializer < ActiveModel::Serializer
  attribute :version_independent_id, key: :questionId
  attribute :content, key: :questionText
  attribute :question_uri, key: :questionUri
  attribute :version, key: :version
  def question_uri
    Rails.application.routes.url_helpers.api_question_url(object.version_independent_id, version: object.version, only_path: true)
  end
end
