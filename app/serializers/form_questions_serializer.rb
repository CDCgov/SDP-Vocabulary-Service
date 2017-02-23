class FormQuestionsSerializer < ActiveModel::Serializer
  attribute :question
  attribute :response_set, key: :response

  def question
    QuestionsSerializer.new(object.question)
  end

  def response_set
    ValueSetsSerializer.new(object.response_set) if object.response_set
  end
end
