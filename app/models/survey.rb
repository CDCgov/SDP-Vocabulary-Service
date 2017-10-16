class Survey < ApplicationRecord
  include Versionable, Searchable, Taggable
  acts_as_commentable

  has_many :survey_sections, -> { order 'position asc' }, dependent: :destroy
  has_many :sections, through: :survey_sections

  belongs_to :created_by, class_name: 'User'
  belongs_to :published_by, class_name: 'User'
  belongs_to :parent, class_name: 'Survey'
  belongs_to :surveillance_system
  belongs_to :surveillance_program

  validates :name, presence: true
  validates :created_by, presence: true
  validates :control_number, allow_blank: true, format: { with: /\A\d{4}-\d{4}\z/,
                                                          message: 'must be a valid OMB Control Number' },
                             uniqueness: { message: 'sections should have different OMB Control Numbers',
                                           unless: proc { |f| f.version > 1 && f.other_versions.map(&:control_number).include?(f.control_number) } }

  accepts_nested_attributes_for :sections, allow_destroy: true

  after_commit :index, on: [:create, :update]

  def questions
    Question.joins(section_questions: { section: { survey_sections: :survey } }).where(surveys: { id: id }).all
  end

  def index
    UpdateIndexJob.perform_later('survey', id)
  end

  def update_section_positions
    SurveySection.transaction do
      survey_sections.each_with_index do |sf, i|
        # Avoiding potential unecessary writes
        if sf.position != i
          sf.position = i
          sf.save!
        end
      end
    end
    save!
  end

  def publish(publisher)
    if status == 'draft'
      self.status = 'published'
      self.published_by = publisher
      save!
    end
    sections.each { |f| f.publish(publisher) }
  end

  # Custom implementation as using the plain relationships in Rails will cause
  # N+1 queries to figure out most recent version for each section.
  def sections_with_most_recent
    Section.find_by_sql(['select f.*, fmv.version as max_version
     from sections f, survey_sections sf,
       (select version_independent_id, MAX(version) as version
         from sections group by version_independent_id) fmv
     where fmv.version_independent_id = f.version_independent_id
     and sf.section_id = f.id
     and sf.survey_id = :survey_id', { survey_id: id }])
  end

  def build_new_revision
    new_revision = Survey.new(version_independent_id: version_independent_id,
                              name: name, parent_id: parent_id,
                              version: version + 1, status: status,
                              created_by: created_by, control_number: control_number)
    concepts.each do |c|
      new_revision.concepts << c.dup
    end

    new_revision
  end
end
