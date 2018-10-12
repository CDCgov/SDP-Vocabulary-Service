class Survey < ApplicationRecord
  include Versionable, Searchable, Taggable, Groupable
  acts_as_commentable
  has_paper_trail versions: :paper_trail_versions, version: :paper_trail_version, on: [:update],
                  ignore: [:created_at, :updated_by_id, :updated_at, :version_independent_id, :published_by_id]

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
                             uniqueness: { message: 'surveys should have different OMB Control Numbers',
                                           unless: proc { |s| s.version > 1 && s.other_versions.map(&:control_number).include?(s.control_number) } }

  accepts_nested_attributes_for :sections, allow_destroy: true

  after_commit :index, on: [:create, :update]
  after_commit :es_destroy, on: [:destroy]

  def es_destroy
    SDP::Elasticsearch.delete_item('survey', id, true)
  end

  def exclusive_use?
    # Need an exclusive use call for cascade block, survey always exclusive
    true
  end

  def omb_approved?
    control_number != nil
  end

  # Returns the number of questions with potential duplicates on the survey
  def q_with_dupes_count(current_user)
    count = 0
    sections.each do |s|
      count += s.q_with_dupes_count(current_user)
    end
    count
  end

  def potential_duplicates(current_user)
    dupes = []
    sections.each do |s|
      q_count = 0
      rs_count = 0
      sect_dupes = s.potential_duplicates(current_user)
      sect_dupes[:questions] ||= []
      sect_dupes[:response_sets] ||= []
      q_count = sect_dupes[:questions].length if sect_dupes[:questions]
      rs_count = sect_dupes[:response_sets].length if sect_dupes[:response_sets]
      if q_count + rs_count > 0
        dupes << { id: s.id, name: s.name, q_count: q_count, rs_count: rs_count, dupes: sect_dupes }
      end
    end
    dupes
  end

  def questions
    Question.joins(section_nested_items: { section: { survey_sections: :survey } }).where(surveys: { id: id }).all
  end

  def nested_sections
    nested_sects = []
    sections.each do |s|
      s.nested_sections.each do |ns|
        nested_sects << ns
      end
    end
    nested_sects
  end

  def index
    UpdateIndexJob.perform_later('survey', id)
  end

  def update_section_positions
    SurveySection.transaction do
      survey_sections.each_with_index do |ss, i|
        # Avoiding potential unecessary writes
        if ss.position != i
          ss.position = i
          ss.save!
        end
      end
    end
    save!
  end

  # Custom implementation as using the plain relationships in Rails will cause
  # N+1 queries to figure out most recent version for each section.
  def sections_with_most_recent
    Section.find_by_sql(["select s.*, smv.version as max_version, smrv.version as most_recent_version
     from sections s, survey_sections ss,
       (select version_independent_id, MAX(version) as version
         from sections group by version_independent_id) smv
       left join (select version_independent_id, MAX(version) as version
         from sections s where s.status = 'published'
         group by version_independent_id) smrv USING (version_independent_id)
     where (smv.version_independent_id = s.version_independent_id
     and ss.section_id = s.id
     and ss.survey_id = :survey_id)", { survey_id: id }])
  end

  def build_new_revision
    new_revision = Survey.new(version_independent_id: version_independent_id,
                              name: name, parent_id: parent_id,
                              version: version + 1, status: status,
                              created_by: created_by, control_number: control_number, omb_approval_date: omb_approval_date)
    concepts.each do |c|
      new_revision.concepts << c.dup
    end

    new_revision
  end

  def page_numbers_present?
    numbers_present = true
    sections.each do |s|
      numbers_present = false if s.concepts.where(display_name: 'PageId').empty?
    end
    numbers_present
  end

  def cascading_action(&block)
    temp_sects = []
    sections.each { |s| temp_sects << s }
    yield self
    temp_sects.each { |s| s.cascading_action(&block) }
  end
end
