class Section < ApplicationRecord
  include OidGenerator, Versionable, Searchable, Taggable
  acts_as_commentable

  has_many :section_questions, -> { order 'position asc' }, dependent: :destroy
  has_many :questions, through: :section_questions
  has_many :response_sets, through: :section_questions
  has_many :survey_sections
  has_many :surveys, through: :survey_sections

  belongs_to :created_by, class_name: 'User'
  belongs_to :published_by, class_name: 'User'
  belongs_to :parent, class_name: 'Section'

  validates :name, presence: true
  validates :created_by, presence: true

  accepts_nested_attributes_for :questions, allow_destroy: true

  after_destroy :update_surveys

  after_commit :index, on: [:create, :update]

  def update_surveys
    survey_array = surveys.to_a
    survey_sections.destroy_all
    survey_array.each(&:update_section_positions)
  end

  def index
    UpdateIndexJob.perform_later('section', id)
  end

  def update_question_positions
    SectionQuestion.transaction do
      section_questions.each_with_index do |sq, i|
        # Avoiding potential unecessary writes
        if sq.position != i
          sq.position = i
          sq.save!
        end
      end
    end
    save!
  end

  # Custom implementation as using the plain relationships in Rails will cause
  # N+1 queries to figure out most recent version for each question.
  def questions_with_most_recent
    Question.find_by_sql(["select q.*, qmv.version as max_version, qmrv.version as most_recent_version
     from questions q, section_questions sq,
       (select version_independent_id, MAX(version) as version
         from questions group by version_independent_id) qmv,
       (select version_independent_id, MAX(version) as version
         from questions q where q.status = 'published'
         group by version_independent_id) qmrv
     where qmv.version_independent_id = q.version_independent_id
     and qmrv.version_independent_id = qmrv.version_independent_id
     and sq.question_id = q.id
     and sq.section_id = :section_id", { section_id: id }])
  end

  def self.owned_by(owner_id)
    where(created_by: owner_id)
  end

  def publish(publisher)
    if status == 'draft'
      self.status = 'published'
      self.published_by = publisher
      save!
      # Updates previous version to no longer be most_recent
      if version > 1
        prev_version = Section.find_by(version_independent_id: version_independent_id,
                                       version: version - 1)
        UpdateIndexJob.perform_later('section', prev_version.id)
      end
    end
    section_questions.each do |sq|
      sq.question.publish(publisher)
      sq.response_set.publish(publisher) if sq.response_set
    end
  end

  # Builds a new section object with the same version_independent_id. Increments
  # the version by one and builds a new set of Response objects to go with it.
  def build_new_revision
    new_revision = Section.new(version_independent_id: version_independent_id,
                               description: description, parent_id: parent_id, status: status,
                               version: version + 1, name: name, oid: oid,
                               created_by: created_by)
    concepts.each do |c|
      new_revision.concepts << c.dup
    end

    new_revision
  end

  # Get the programs that the section is associated with by the surveys that the
  # section is contained in
  def surveillance_programs
    SurveillanceProgram.joins(surveys: :survey_sections)
                       .where('survey_sections.section_id = ?', id).select(:id, :name).distinct.to_a
  end

  def surveillance_systems
    SurveillanceSystem.joins(surveys: :survey_sections)
                      .where('survey_sections.section_id = ?', id).select(:id, :name).distinct.to_a
  end
end
