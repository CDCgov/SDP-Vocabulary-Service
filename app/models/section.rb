# rubocop:disable Metrics/ClassLength
class Section < ApplicationRecord
  include OidGenerator, Versionable, Searchable, Mappable, Groupable
  acts_as_commentable
  acts_as_taggable
  has_paper_trail versions: :paper_trail_versions, version: :paper_trail_version, on: [:update],
                  ignore: [:created_at, :updated_by_id, :updated_at, :version_independent_id, :published_by_id, :tag_list]

  has_many :section_nested_items, -> { order 'position asc' }, dependent: :destroy
  has_many :nested_sections, through: :section_nested_items
  has_many :questions, through: :section_nested_items
  has_many :response_sets, through: :section_nested_items
  has_many :survey_sections
  has_many :surveys, through: :survey_sections
  has_many :parent_section_nested_items, foreign_key: :nested_section_id, class_name: 'SectionNestedItem'

  belongs_to :created_by, class_name: 'User'
  belongs_to :published_by, class_name: 'User'
  belongs_to :parent, class_name: 'Section'

  validates :name, presence: true
  validates :created_by, presence: true
  validates :oid, allow_blank: true, format: { with: /\A[\d.]+\z/, message: 'OID must be correct format' }

  accepts_nested_attributes_for :questions, allow_destroy: true

  after_destroy :update_surveys
  after_destroy :update_nested_sections
  after_destroy :update_parent_sections

  after_commit :index, on: [:create, :update]
  after_commit :es_destroy, on: [:destroy]

  def es_destroy
    SDP::Elasticsearch.delete_item('section', id, true)
  end

  def exclusive_use?
    # Checking if the survey or parent section that was just destroyed was the only link
    surveys.empty? && parent.nil?
  end

  def omb_approved?
    omb_flag = false
    surveys.each do |survey|
      omb_flag = true if survey.omb_approved?
    end
    snis = SectionNestedItem.where(nested_section_id: id)
    snis.each do |sni|
      omb_flag = true if sni.section.omb_approved?
    end
    omb_flag
  end

  def surveys_with_path
    s_with_path = []
    if surveys.count == 0 && parent_sections.count == 0
      s_with_path << [{ id: id, name: name, type: 'section' }]
    end
    surveys.each do |surv|
      s_with_path << [{ id: surv.id, name: surv.name }, { id: id, name: name }]
    end
    parent_sections.each do |ps|
      s_with_path += ps.surveys_with_path.map { |path| path << { id: id, name: name } }
    end
    s_with_path
  end

  # Returns the number of questions with potential duplicates on the section
  def q_with_dupes_count(current_user)
    count = 0
    if SDP::Elasticsearch.ping
      current_user_id = current_user ? current_user.id : nil
      current_user_groups = current_user ? current_user.groups : []
      flatten_questions.each do |sni|
        if sni.question
          results = SDP::Elasticsearch.find_duplicates(sni.question, current_user_id, current_user_groups)
          count += 1 if results && results['hits'] && results['hits']['total'] > 0
        end
        if sni.response_set
          rs_results = SDP::Elasticsearch.find_duplicates(sni.response_set, current_user_id, current_user_groups)
          count += 1 if rs_results && rs_results['hits'] && rs_results['hits']['total'] > 0
        end
      end
    end
    count
  end

  def potential_duplicates(current_user)
    bdf = SDP::Elasticsearch::BatchDuplicateFinder.new
    flatten_questions.each do |sni|
      sni.question.enque_duplicate_finder(bdf) if sni.question
      sni.response_set.enque_duplicate_finder(bdf, sni.question) if sni.response_set && sni.question
    end
    current_user_id = current_user ? current_user.id : nil
    current_user_groups = current_user ? current_user.groups : []
    bdf.execute(current_user_id, current_user_groups)
  end

  def parent_sections
    parent_section_nested_items.map(&:section)
  end

  def update_parent_sections
    section_array = parent_sections.to_a
    parent_section_nested_items.destroy_all
    section_array.each(&:update_item_positions)
  end

  def update_surveys
    survey_array = surveys.to_a
    survey_sections.destroy_all
    survey_array.each(&:update_section_positions)
  end

  def item_groups
    igrs = {}
    count = 1
    section_nested_items.each do |sni|
      if sni.nested_section
        igrs[sni.nested_section.name] = sni.all_questions
      else
        igrs["stand_alone_question_#{count}"] = [sni]
        count += 1
      end
    end
    igrs
  end

  def update_nested_sections
    section_array = nested_sections.to_a
    section_nested_items.destroy_all
    section_array.each(&:update_item_positions)
  end

  def index
    UpdateIndexJob.perform_later('section', id)
  end

  def update_item_positions
    SectionNestedItem.transaction do
      section_nested_items.each_with_index do |sni, i|
        # Avoiding potential unecessary writes
        if sni.position != i
          sni.position = i
          sni.save!
        end
      end
    end
    save!
  end

  # Custom implementation as using the plain relationships in Rails will cause
  # N+1 queries to figure out most recent version for each question.
  def questions_with_most_recent
    Question.find_by_sql(["select q.*, qmv.version as max_version, qmrv.version as most_recent_version
     from questions q, section_nested_items sni,
       (select version_independent_id, MAX(version) as version
         from questions group by version_independent_id) qmv
       left join (select version_independent_id, MAX(version) as version
         from questions q where q.status = 'published'
         group by version_independent_id) qmrv USING (version_independent_id)
     where (qmv.version_independent_id = q.version_independent_id
     and sni.question_id = q.id
     and sni.section_id = :section_id)", { section_id: id }])
  end

  def self.owned_by(owner_id)
    where(created_by: owner_id)
  end

  def page_id
    concepts.where(display_name: 'PageId')[0].value
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

  def update_snis(snis)
    new_qs_hash = {}
    new_ns_hash = {}
    updated_snis = []
    snis.each do |sni|
      if sni[:question_id]
        new_qs_hash[sni[:question_id]] = sni
      else
        new_ns_hash[sni[:nested_section_id]] = sni
      end
    end
    # Be aware, wrapping this loop in a transaction improves perf by batching all the updates to be committed at once
    SectionNestedItem.transaction do
      section_nested_items.each do |sni|
        if new_qs_hash.include? sni.question_id
          updated_snis << sni.update_section_nested_item(sni, new_qs_hash.delete(sni.question_id))
        elsif new_ns_hash.include? sni.nested_section_id
          updated_snis << sni.update_section_nested_item(sni, new_ns_hash.delete(sni.nested_section_id))
        else
          sni.destroy!
        end
      end
    end
    # any new section nested item still in this hash needs to be created
    new_qs_hash.each do |_id, sni|
      updated_snis << SectionNestedItem.new(question_id: sni[:question_id], response_set_id: sni[:response_set_id],\
                                            position: sni[:position], program_var: sni[:program_var])
    end
    new_ns_hash.each do |_id, sni|
      updated_snis << SectionNestedItem.new(nested_section_id: sni[:nested_section_id], position: sni[:position], program_var: sni[:program_var])
    end
    updated_snis
  end

  def cascading_action(&block)
    temp_qs = []
    temp_nested_sections = []
    temp_response_sets = []
    section_nested_items.each do |sni|
      temp_qs << sni.question if sni.question
      temp_nested_sections << sni.nested_section if sni.nested_section
      temp_response_sets << sni.response_set if sni.response_set
    end
    yield self
    temp_qs.each { |q| q.cascading_action(&block) }
    temp_nested_sections.each { |ns| ns.cascading_action(&block) }
    temp_response_sets.each { |rs| rs.cascading_action(&block) }
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

  def surveillance_programs_usage
    programs_usage = []
    surveys.each do |surv|
      programs_usage << surv.surveillance_program.name if surv.surveillance_program
    end
    parent_sections.each do |ps|
      programs_usage += ps.surveillance_programs_usage
    end
    programs_usage.uniq
  end

  def surveillance_systems_usage
    systems_usage = []
    surveys.each do |surv|
      systems_usage << surv.surveillance_system.name if surv.surveillance_system
    end
    parent_sections.each do |ps|
      systems_usage += ps.surveillance_systems_usage
    end
    systems_usage.uniq
  end

  # Provides a list of nested items that are only questions by flattening out
  # any subsections. Works recursively
  def flatten_questions
    flat_questions = []
    section_nested_items.includes(:question, response_set: [:responses]).each do |sni|
      if sni.question.present?
        flat_questions << sni
      else
        flat_questions.concat(sni.nested_section.flatten_questions)
      end
    end
    flat_questions
  end

  def flatten_nested_sections
    flat_nested_sections = []
    section_nested_items.each do |sni|
      if sni.nested_section.present?
        flat_nested_sections << sni
        flat_nested_sections.concat(sni.nested_section.flatten_nested_sections)
      end
    end
    flat_nested_sections
  end

  def calculate_section_height
    height = 0.03 # start with 0.025 for section name + 0.05 for bottom border
    height += flatten_nested_sections.length * 0.03
    height += flatten_questions.length * 0.05
    height = 1 if height > 1
    height
  end

  def nested_item_names
    names = ''
    items = section_nested_items.map { |sni| sni.nested_section ? sni.nested_section.name : sni.question.content }
    items.each { |str| names << str.parameterize.underscore.camelize.truncate(40, omission: '') + ',' }
    names.chomp(',')
  end
end
