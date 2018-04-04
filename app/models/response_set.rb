class ResponseSet < ApplicationRecord
  include Versionable, OidGenerator, Searchable, Groupable
  SOURCE_OPTIONS = %w(local PHIN_VADS).freeze
  acts_as_commentable

  has_many :question_response_sets, dependent: :destroy
  has_many :questions, through: :question_response_sets
  has_many :responses, dependent: :destroy
  has_many :section_nested_items, dependent: :nullify
  has_many :sections, through: :section_nested_items

  belongs_to :created_by, class_name: 'User'
  belongs_to :updated_by, class_name: 'User'
  belongs_to :published_by, class_name: 'User'

  belongs_to :parent, class_name: 'ResponseSet'

  validates :status, presence: true
  validates :name, presence: true
  validates :created_by, presence: true
  validates :source, presence: true, inclusion: { in: SOURCE_OPTIONS }
  validates :oid, allow_blank: true, format: { with: /\A[\d.]+\z/, message: 'OID must be correct format' }

  accepts_nested_attributes_for :responses, allow_destroy: true

  after_commit :index, on: [:create, :update]
  after_commit :es_destroy, on: [:destroy]

  def es_destroy
    SDP::Elasticsearch.delete_item('response_set', id, true)
  end

  def exclusive_use?
    # Checking if the question or section that was just destroyed was the only link
    sections.empty? && questions.empty?
  end

  def self.most_recent_for_oid(oid)
    where(oid: oid).order(version: :desc).first
  end

  def index
    UpdateIndexJob.perform_later('response_set', id)
  end

  # Builds a new ResponseSet object with the same version_independent_id. Increments
  # the version by one and builds a new set of Response objects to go with it.
  def build_new_revision
    new_revision = ResponseSet.new(version_independent_id: version_independent_id,
                                   version: version + 1, description: description,
                                   status: status, name: name,
                                   parent_id: parent_id, oid: oid)
    responses.each do |r|
      new_revision.responses << r.dup
    end

    new_revision
  end

  def cascading_action
    yield self
  end

  def extend_from
    extended_set = ResponseSet.new
    extended_set.name = name
    extended_set.description = description
    extended_set.status = status
    extended_set.parent = self
    extended_set.version = 1
    extended_set.version_independent_id = nil
    extended_set.responses = responses.collect(&:dup)
    extended_set
  end

  def response_values?
    has_values = true
    responses.each do |resp|
      has_values = false if resp.value.blank?
    end
    has_values
  end

  def surveillance_programs
    SurveillanceProgram.joins(surveys: :survey_sections)
                       .joins('INNER join section_nested_items on section_nested_items.section_id = survey_sections.section_id')
                       .where('section_nested_items.response_set_id = ?', id).select(:id, :name).distinct.to_a
  end

  def surveillance_systems
    SurveillanceSystem.joins(surveys: :survey_sections)
                      .joins('INNER join section_nested_items on section_nested_items.section_id = survey_sections.section_id')
                      .where('section_nested_items.response_set_id = ?', id).select(:id, :name).distinct.to_a
  end
end
