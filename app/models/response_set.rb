class ResponseSet < ApplicationRecord
  include Versionable, OidGenerator, Searchable, Groupable
  SOURCE_OPTIONS = %w(local PHIN_VADS).freeze
  acts_as_commentable
  acts_as_taggable
  has_paper_trail versions: :paper_trail_versions, version: :paper_trail_version, on: [:update],
                  ignore: [:created_at, :updated_by_id, :updated_at, :version_independent_id, :published_by_id, :tag_list]

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

  def omb_approved?
    omb_flag = false
    sections.each { |s| omb_flag = true if s.omb_approved? }
    omb_flag
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

  def potential_duplicates(current_user, question)
    current_user_id = current_user ? current_user.id : nil
    current_user_groups = current_user ? current_user.groups : []
    rs_results = SDP::Elasticsearch.find_duplicates(self, current_user_id, current_user_groups)
    if rs_results && rs_results['hits'] && rs_results['hits']['total'] > 0
      { draft_response_set: { id: id, linked_question: { id: question.id, content: question.content }, status: status, content_stage: content_stage,
                              name: name, description: description, responses: responses },
        potential_duplicates: rs_results['hits']['hits'] }
    else
      false
    end
  end

  def enque_duplicate_finder(batch, question)
    batch.add_to_batch(self, :response_sets) do |rs_results|
      if rs_results && rs_results['hits'] && rs_results['hits']['total'] > 0
        { draft_response_set: { id: id, linked_question: { id: question.id, content: question.content }, status: status, content_stage: content_stage,
                                name: name, description: description, responses: responses },
          potential_duplicates: rs_results['hits']['hits'] }
      else
        false
      end
    end
  end

  def mark_as_duplicate(replacement)
    section_nested_items.each do |sni|
      sni.response_set = replacement
      sni.save
    end
    # Keeping track of previously deleted dupes and incrementing deletions by 1
    replacement.duplicates_replaced_count += duplicates_replaced_count + 1
    replacement.save!
  end

  def link_to_duplicate(replacement)
    self.duplicate_of = replacement
    self.content_stage = 'Duplicate'
    self.duplicates_replaced_count += 1
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
