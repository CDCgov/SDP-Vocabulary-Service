include ActiveModel::Serialization

class QuestionsSerializer < ActiveModel::Serializer
  attribute :id, key: :questionId
  attribute :content, key: :questionText
  attribute :questionUri
  def questionUri
    Rails.application.routes.url_helpers.question_url(object)
  end
end
