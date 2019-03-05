include ActiveModel::Serialization

class ESResponseSetSerializer < ActiveModel::Serializer
  attribute :id
  attribute :name
  attribute :oid
  attribute :version_independent_id
  attribute :version
  attribute :status
  attribute :content_stage
  attribute :category
  attribute :description
  attribute :updated_at, key: :updatedAt
  attribute :created_at, key: :createdAt
  attribute :curated_at, key: :curatedAt
  attribute :suggest
  attribute :updated_by, key: :updatedBy
  attribute :created_by, key: :createdBy
  attribute :questions
  attribute :codes
  attribute :surveillance_programs
  attribute :surveillance_systems
  attribute :most_recent
  attribute :groups
  attribute :preferred
  attribute :omb
  attribute :source
  attribute :response_count
  attribute :tag_list

  def most_recent
    object.most_recent?
  end

  def omb
    object.omb_approved?
  end

  def response_count
    object.responses.count
  end

  def codes
    if object.responses.count <= 25
      object.responses.collect { |c| CodeSerializer.new(c).as_json }
    else
      object.responses.first(25).collect { |c| CodeSerializer.new(c).as_json }
    end
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
    object.questions.collect do |q|
      { id: q.id, name: q.content }
    end
  end

  def suggest
    object.name.empty? ? 'No Suggestion' : object.name
  end

  def category
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
