class FormQuestionsSerializer < ActiveModel::Serializer
  attribute :question do
    QuestionsSerializer.new(object.question)
  end
  attribute :response do
    ValueSetsSerializer.new(object.response_set) if object.response_set
  end
  attribute :program_var
end
