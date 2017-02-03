include ActiveModel::Serialization

class ESResponseSetSerializer < ActiveModel::Serializer
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
  attribute :codes

  def codes
    object.responses.collect { |c| CodeSerializer.new(c) }
  end

  def forms
    object.form_questions.collect do |fq|
      { id: fq.form.id, name: fq.form.name }
    end
  end

  def questions
    object.form_questions.collect do |fq|
      { id: fq.question_id, name: fq.question_content }
    end
  end

  def suggest
    object.name
  end
end
