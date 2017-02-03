include ActiveModel::Serialization

class ESQuestionSerializer < ActiveModel::Serializer
  attribute :id
  attribute :content, key: :name
  attribute :version_independent_id
  attribute :version
  attribute :status
  attribute :category
  attribute :description
  attribute :created_at, key: :createdAt
  attribute :updated_at, key: :updatedAt
  attribute :suggest
  attribute :updated_by, key: :updatedBy
  attribute :created_by, key: :createdBy
  attribute :response_sets, key: :responseSets
  attribute :codes
  attribute :forms

  def forms
    object.form_questions.collect do |fq|
      { id: fq.form.id, name: fq.form.name }
    end
  end

  def codes
    object.concepts.collect { |c| CodeSerializer.new(c).as_json }
  end

  def response_sets
    object.response_sets.collect do |rs|
      { id: rs.id, name: rs.name }
    end
  end

  def suggest
    object.content
  end

  def category
    object.question_type.name if object.question_type
  end

  def status
    'draft'
  end

  def description
  end

  def updated_by
    UserSerializer.new(object.updated_by).as_json if object.updated_by
  end

  def created_by
    UserSerializer.new(object.created_by).as_json if object.created_by
  end
end
