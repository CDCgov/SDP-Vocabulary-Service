include ActiveModel::Serialization

class QuestionsSerializer < ActiveModel::Serializer
  attribute :id, key: :questionId
  attribute :content, key: :questionText
  attribute :questionUri
  def questionUri
    Rails.application.routes.url_helpers.api_question_url(object, :only_path => true)
  end
end
