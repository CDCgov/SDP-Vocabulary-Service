class Question < ApplicationRecord
  include Versionable, OidGenerator, Searchable
  acts_as_commentable

  has_many :question_response_sets, dependent: :destroy
  has_many :response_sets, through: :question_response_sets
  has_many :form_questions
  has_many :forms, through: :form_questions
  has_many :concepts, dependent: :destroy

  belongs_to :response_type
  belongs_to :question_type
  belongs_to :created_by, class_name: 'User'
  belongs_to :updated_by, class_name: 'User'
  belongs_to :published_by, class_name: 'User'
  belongs_to :parent, class_name: 'Question'

  validates :content, presence: true
  validates :response_type, presence: true
  validate :other_allowed_on_when_choice
  accepts_nested_attributes_for :concepts, allow_destroy: true

  after_destroy :update_forms
  after_commit :index, on: [:create, :update]
  after_commit :delete_index, on: :destroy

  def update_forms
    forms.each do |f|
      f.remove_question(id)
    end
  end

  def index
    UpdateIndexJob.perform_later('question', self)
  end

  def delete_index
    DeleteFromIndexJob.perform_later('question', id)
  end

  def publish(publisher)
    if status == 'draft'
      self.status = 'published'
      self.published_by = publisher
      save!
    end
    response_sets.each { |rs| rs.publish(publisher) }
  end

  def build_new_revision
    new_revision = Question.new(content: content, description: description, status: status,
                                version_independent_id: version_independent_id,
                                version: version + 1, question_response_sets: question_response_sets,
                                response_sets: response_sets, form_questions: form_questions, forms: forms,
                                question_type: question_type, oid: oid, parent_id: parent_id,
                                response_type: response_type)
    concepts.each do |c|
      new_revision.concepts << c.dup
    end

    new_revision
  end

  # Get the programs that the form is associated with by the surveys that the
  # form is contained in
  def surveillance_programs
    SurveillanceProgram.joins(surveys: :survey_forms)
                       .joins('INNER join form_questions on form_questions.form_id = survey_forms.form_id')
                       .where('form_questions.question_id = ?', id).select(:id, :name).distinct.to_a
  end

  def surveillance_systems
    SurveillanceSystem.joins(surveys: :survey_forms)
                      .joins('INNER join form_questions on form_questions.form_id = survey_forms.form_id')
                      .where('form_questions.question_id = ?', id).select(:id, :name).distinct.to_a
  end

  def other_allowed_on_when_choice
    if other_allowed && (response_type.blank? || response_type.code != 'choice')
      errors.add(:other_allowed, "can't be true unless the response type is choice")
    end
  end
end
