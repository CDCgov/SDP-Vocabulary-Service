include ActiveModel::Serialization

class ESQuestionSerializer < ActiveModel::Serializer
  attribute :id
  attribute :content, key: :name
  attribute :version_independent_id
  attribute :version
  attribute :status
  attribute :category
  attribute :subcategory
  attribute :description
  attribute :updated_at, key: :updatedAt
  attribute :created_at, key: :createdAt
  attribute :suggest
  attribute :updated_by, key: :updatedBy
  attribute :created_by, key: :createdBy
  attribute :response_sets, key: :responseSets
  attribute(:codes) { codes }
  attribute :sections
  attribute :surveillance_programs
  attribute :surveillance_systems
  attribute :response_type
  attribute :most_recent
  attribute :groups

  def most_recent
    object.most_recent?
  end

  def sections
    object.section_nested_items.includes(:section).collect do |sni|
      { id: sni.section.id, name: sni.section.name }
    end
  end

  def codes
    object.concepts.collect { |c| CodeSerializer.new(c).as_json }
  end

  def groups
    object.group_ids
  end

  def response_type
    { id: object.response_type.id, name: object.response_type.name, code: object.response_type.code } if object.response_type
  end

  def response_sets
    object.response_sets.collect do |rs|
      { id: rs.id, name: rs.name }
    end
  end

  def suggest
    object.content.empty? ? 'No Suggestion' : object.content
  end

  def category
    { id: object.category.id, name: object.category.name } if object.category
  end

  def subcategory
    { id: object.subcategory.id, name: object.subcategory.name } if object.subcategory
  end

  def updated_at
    object.updated_at.as_json if object.updated_at
  end

  def created_at
    object.created_at.as_json if object.created_at
  end

  def updated_by
    UserSerializer.new(object.updated_by).as_json if object.updated_by
  end

  def created_by
    UserSerializer.new(object.created_by).as_json if object.created_by
  end

  delegate :surveillance_programs, to: :object

  delegate :surveillance_systems, to: :object
end
