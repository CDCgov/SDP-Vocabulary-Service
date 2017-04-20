class FormQuestionsSerializer < ActiveModel::Serializer
  attribute :question
  attribute :response_set, key: :response
  attribute :program_var

  def question
    QuestionsSerializer.new(object.question)
  end

  def response_set
    ValueSetsSerializer.new(object.response_set) if object.response_set
  end
end
