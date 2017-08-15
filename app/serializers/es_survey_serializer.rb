include ActiveModel::Serialization

class ESSurveySerializer < ActiveModel::Serializer
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
  attribute :forms
  attribute :surveillance_program
  attribute :surveillance_system
  attribute(:codes) { codes }

  def codes
    [] # object.concepts.collect { |c| CodeSerializer.new(c).as_json }
  end

  def updated_at
    object.updated_at.as_json if object.updated_at
  end

  def created_at
    object.created_at.as_json if object.created_at
  end

  def questions
    form_questions = []
    object.survey_forms.includes(form: { form_questions: [:response_set, { question: :concepts }] }).each do |sf|
      form_questions.concat sf.form.form_questions.to_a
    end
    form_questions.collect do |fq|
      { id: fq.question_id,
        name: fq.question.content,
        codes: (fq.question.concepts || []).collect { |c| CodeSerializer.new(c).as_json },
        response_set: fq.response_set.try(:name),
        response_set_id: fq.response_set_id }
    end
  end

  def forms
    object.survey_forms.includes(:form).collect do |sf|
      { id: sf.form_id, name: sf.form.name }
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

  def surveillance_system
    { id: object.surveillance_system.id,
      name: object.surveillance_system.name } if object.surveillance_system
  end

  def surveillance_program
    { id: object.surveillance_program.id,
      name: object.surveillance_program.name } if object.surveillance_program
  end
end
