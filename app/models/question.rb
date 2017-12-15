class Question < ApplicationRecord
  include Versionable, OidGenerator, Searchable, Taggable, Groupable
  acts_as_commentable

  has_many :question_response_sets, dependent: :destroy
  has_many :response_sets, through: :question_response_sets
  has_many :section_questions
  has_many :sections, through: :section_questions

  belongs_to :response_type
  belongs_to :category
  belongs_to :subcategory
  belongs_to :created_by, class_name: 'User'
  belongs_to :updated_by, class_name: 'User'
  belongs_to :published_by, class_name: 'User'
  belongs_to :parent, class_name: 'Question'

  validates :content, presence: true
  validates :response_type, presence: true
  validate :other_allowed_on_when_choice

  after_destroy :update_sections

  after_commit :index, on: [:create, :update]

  def update_sections
    section_array = sections.to_a
    section_questions.destroy_all
    section_array.each(&:update_question_positions)
  end

  def index
    UpdateIndexJob.perform_later('question', id)
  end

  def build_new_revision
    new_revision = Question.new(content: content, description: description, status: status,
                                version_independent_id: version_independent_id,
                                version: version + 1, question_response_sets: question_response_sets,
                                response_sets: response_sets, section_questions: section_questions, sections: sections,
                                category: category, oid: oid, parent_id: parent_id, subcategory: subcategory,
                                response_type: response_type)
    concepts.each do |c|
      new_revision.concepts << c.dup
    end

    new_revision
  end

  def cascading_action(&block)
    yield self
    response_sets.each { |rs| rs.cascading_action(&block) }
  end

  # Get the programs that the section is associated with by the surveys that the
  # section is contained in
  def surveillance_programs
    SurveillanceProgram.joins(surveys: :survey_sections)
                       .joins('INNER join section_questions on section_questions.section_id = survey_sections.section_id')
                       .where('section_questions.question_id = ?', id).select(:id, :name).distinct.to_a
  end

  def surveillance_systems
    SurveillanceSystem.joins(surveys: :survey_sections)
                      .joins('INNER join section_questions on section_questions.section_id = survey_sections.section_id')
                      .where('section_questions.question_id = ?', id).select(:id, :name).distinct.to_a
  end

  def other_allowed_on_when_choice
    if other_allowed && (response_type.blank? || response_type.code != 'choice')
      errors.add(:other_allowed, "can't be true unless the response type is choice")
    end
  end
end
