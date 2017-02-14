include ActiveModel::Serialization

class ESResponseSetSerializer < ActiveModel::Serializer
  attribute :id
  attribute :name
  attribute :version_independent_id
  attribute :version
  attribute :status
  attribute :category
  attribute :description
  attribute :updated_at, key: :updatedAt
  attribute :created_at, key: :createdAt
  attribute :suggest
  attribute :updated_by, key: :updatedBy
  attribute :created_by, key: :createdBy
  attribute :questions
  attribute :codes

  def codes
    object.responses.collect { |c| CodeSerializer.new(c).as_json }
  end

  def updated_at
    object.updated_at.as_json if object.updated_at
  end

  def created_at
    object.created_at.as_json if object.created_at
  end

  def forms
    object.form_questions.collect do |fq|
      { id: fq.form.id, name: fq.form.name }
    end
  end

  def questions
    object.form_questions.collect do |fq|
      { id: fq.question_id, name: fq.question.content }
    end
  end

  def suggest
    object.name
  end

  def category
  end

  def status
    'draft'
  end

  def updated_by
    UserSerializer.new(object.updated_by).as_json if object.updated_by
  end

  def created_by
    UserSerializer.new(object.created_by).as_json if object.created_by
  end
end
