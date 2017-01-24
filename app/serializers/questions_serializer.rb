include ActiveModel::Serialization

class QuestionsSerializer < ActiveModel::Serializer
  attribute :version_independent_id, key: :questionId
  attribute :content, key: :questionText
  attribute :question_uri, key: :questionUri
  attribute :version, key: :version
  def question_uri
    '/api/questions/' + object.version_independent_id
  end
end
