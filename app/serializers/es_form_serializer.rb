include ActiveModel::Serialization

class ESFormSerializer < ActiveModel::Serializer
  attribute :id
  attribute :name
  attribute :version_independent_id
  attribute :version
  attribute :status
  attribute :category
  attribute :description
  attribute :createdAt
  attribute :updatedAt
  attribute :suggest
  attribute :updatedBy
  attribute :createdBy
  attribute :questions

  def codes
    object.codes.collect { |c| CodeSerializer.new(c) }
  end

  def questions
    object.form_questions.collect do |fq|
      { id: fq.question_id,
        name: fq.question.content,
        codes: question_codes(fq.question.codes),
        response_set: fq.response_set.name,
        response_set_id: fq.response_set_id }
    end
  end

  def suggest
    object.name
  end
end
