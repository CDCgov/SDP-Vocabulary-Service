class ResponseSet < ApplicationRecord
  include Versionable, OidGenerator, Searchable
  SOURCE_OPTIONS = %w(local PHIN_VADS).freeze
  acts_as_commentable

  has_many :question_response_sets, dependent: :destroy
  has_many :questions, through: :question_response_sets
  has_many :responses, dependent: :destroy
  has_many :form_questions, dependent: :nullify
  has_many :forms, through: :form_questions

  belongs_to :created_by, class_name: 'User'
  belongs_to :updated_by, class_name: 'User'
  belongs_to :parent, class_name: 'ResponseSet'

  validates :status, presence: true
  validates :name, presence: true
  validates :created_by, presence: true
  validates :source, presence: true, inclusion: { in: SOURCE_OPTIONS }

  accepts_nested_attributes_for :responses, allow_destroy: true

  after_commit :index, on: [:create, :update]
  after_commit :delete_index, on: :destroy

  def index
    UpdateIndexJob.perform_later('response_set', ESResponseSetSerializer.new(self).as_json)
  end

  def delete_index
    DeleteFromIndexJob.perform_later('response_set', id)
  end

  def publish
    update(status: 'published') if status == 'draft'
  end

  # Builds a new ResponseSet object with the same version_independent_id. Increments
  # the version by one and builds a new set of Response objects to go with it.
  def build_new_revision
    new_revision = ResponseSet.new(version_independent_id: version_independent_id,
                                   version: version + 1, description: description,
                                   status: status, name: name, coded: coded,
                                   parent_id: parent_id, oid: oid)
    responses.each do |r|
      new_revision.responses << r.dup
    end

    new_revision
  end

  def extend_from
    extended_set = ResponseSet.new
    extended_set.name = name
    extended_set.description = description
    extended_set.status = status
    extended_set.coded  = coded
    extended_set.parent = self
    extended_set.version = 1
    extended_set.version_independent_id = nil
    extended_set.responses = responses.collect(&:dup)
    extended_set
  end

  def surveillance_programs
    SurveillanceProgram.joins(surveys: :survey_forms)
                       .joins('INNER join form_questions on form_questions.form_id = survey_forms.form_id')
                       .where('form_questions.response_set_id = ?', id).select(:id, :name).distinct.to_a
  end

  def surveillance_systems
    SurveillanceSystem.joins(surveys: :survey_forms)
                      .joins('INNER join form_questions on form_questions.form_id = survey_forms.form_id')
                      .where('form_questions.response_set_id = ?', id).select(:id, :name).distinct.to_a
  end
end
