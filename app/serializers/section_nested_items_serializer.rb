class SectionNestedItemsSerializer < ActiveModel::Serializer
  attribute :question do
    QuestionsSerializer.new(object.question)
  end
  attribute :response do
    ValueSetsSerializer.new(object.response_set) if object.response_set
  end
  attribute :nested_section do
    SectionSerializer.new(object.nested_section) if object.nested_section
  end
  attribute :program_var
end
