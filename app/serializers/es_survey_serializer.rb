include ActiveModel::Serialization

class ESSurveySerializer < ActiveModel::Serializer
  attribute :id
  attribute :name
  attribute :version_independent_id
  attribute :version
  attribute :status
  attribute :content_stage
  attribute :category
  attribute :description
  attribute :updated_at, key: :updatedAt
  attribute :created_at, key: :createdAt
  attribute :suggest
  attribute :updated_by, key: :updatedBy
  attribute :created_by, key: :createdBy
  attribute :questions
  attribute :sections
  attribute :surveillance_program
  attribute :surveillance_system
  attribute(:codes) { codes }
  attribute :most_recent
  attribute :groups
  attribute :preferred
  attribute :omb
  attribute :control_number, key: :controlNumber
  attribute :omb_approval_date, key: :ombApprovalDate
  attribute :tag_list
  attribute :most_recent_id

  def most_recent_id
    object.most_recent
  end

  def most_recent
    object.most_recent?
  end

  def omb
    object.omb_approved?
  end

  def codes
    object.concepts.collect { |c| CodeSerializer.new(c).as_json }
  end

  def groups
    object.group_ids
  end

  def updated_at
    object.updated_at.as_json if object.updated_at
  end

  def created_at
    object.created_at.as_json if object.created_at
  end

  def questions
    section_nested_items = []
    object.survey_sections.includes(section: { section_nested_items: [:response_set, { question: :concepts }, { nested_section: :concepts }] }).each do |ss|
      section_nested_items.concat ss.section.section_nested_items.to_a
    end
    section_nested_items.collect do |sni|
      next unless sni.question
      { id: sni.question_id,
        name: sni.question.content,
        codes: (sni.question.concepts || []).collect { |c| CodeSerializer.new(c).as_json },
        response_set: sni.response_set.try(:name),
        response_set_id: sni.response_set_id }
    end
  end

  def sections
    object.survey_sections.includes(:section).collect do |ss|
      { id: ss.section_id, name: ss.section.name, version: ss.section.version }
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
