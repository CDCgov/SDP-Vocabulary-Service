include ActiveModel::Serialization

class ESSectionSerializer < ActiveModel::Serializer
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
  attribute :section_nested_items
  attribute :surveys
  attribute(:codes) { codes }
  attribute :surveillance_programs
  attribute :surveillance_systems
  attribute :most_recent
  attribute :groups
  attribute :omb
  attribute :preferred
  attribute :tag_list

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

  def section_nested_items
    object.section_nested_items.includes(:response_set, question: [:concepts], nested_section: [:concepts]).collect do |sni|
      if sni.question
        { id: sni.question_id,
          name: sni.question.content,
          type: 'question',
          codes: (sni.question.concepts || []).collect { |c| CodeSerializer.new(c).as_json },
          response_set: sni.response_set.try(:name),
          response_set_id: sni.response_set_id }
      elsif sni.nested_section
        { id: sni.nested_section_id,
          name: sni.nested_section.name,
          type: 'section',
          codes: (sni.nested_section.concepts || []).collect { |c| CodeSerializer.new(c).as_json } }
      end
    end
  end

  def surveys
    object.survey_sections.includes(:survey).collect do |ss|
      { id: ss.survey_id,
        name: ss.survey.name }
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
