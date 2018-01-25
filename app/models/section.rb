class Section < ApplicationRecord
  include OidGenerator, Versionable, Searchable, Taggable, Groupable
  acts_as_commentable

  has_many :section_nested_items, -> { order 'position asc' }, dependent: :destroy
  has_many :nested_sections, through: :section_nested_items
  has_many :questions, through: :section_nested_items
  has_many :response_sets, through: :section_nested_items
  has_many :survey_sections
  has_many :surveys, through: :survey_sections

  belongs_to :created_by, class_name: 'User'
  belongs_to :published_by, class_name: 'User'
  belongs_to :parent, class_name: 'Section'

  validates :name, presence: true
  validates :created_by, presence: true

  accepts_nested_attributes_for :questions, allow_destroy: true

  after_destroy :update_surveys
  after_destroy :update_nested_sections

  after_commit :index, on: [:create, :update]

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
    yield self
    section_nested_items.each do |sni|
      sni.nested_section.cascading_action(&block) if sni.nested_section
      sni.question.cascading_action(&block) if sni.question
      sni.response_set.cascading_action(&block) if sni.response_set
    end
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
