include ActiveModel::Serialization

class ESSectionSerializer < ActiveModel::Serializer
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
  attribute :surveys
  attribute(:codes) { codes }
  attribute :surveillance_programs
  attribute :surveillance_systems

  def codes
    object.concepts.collect { |c| CodeSerializer.new(c).as_json }
  end

  def updated_at
    object.updated_at.as_json if object.updated_at
  end

  def created_at
    object.created_at.as_json if object.created_at
  end

  def questions
    object.section_questions.includes(:response_set, question: [:concepts]).collect do |sq|
      { id: sq.question_id,
        name: sq.question.content,
        codes: (sq.question.concepts || []).collect { |c| CodeSerializer.new(c).as_json },
        response_set: sq.response_set.try(:name),
        response_set_id: sq.response_set_id }
    end
  end

  def surveys
    object.survey_sections.includes(:survey).collect do |sq|
      { id: sq.survey_id,
        name: sq.survey.name }
    end
  end

  def suggest
    object.name.empty? ? 'No Suggestion' : object.name
  end

  def category
  end

  def updated_by
    # UserSerializer.new(object.updated_by).as_json if object.updated_by
  end

  def created_by
    UserSerializer.new(object.created_by).as_json if object.created_by
  end

  delegate :surveillance_programs, to: :object

  delegate :surveillance_systems, to: :object
end
