class Question < ApplicationRecord
  include Versionable, OidGenerator, Searchable, Mappable, Groupable
  acts_as_commentable
  acts_as_taggable
  has_paper_trail versions: :paper_trail_versions, version: :paper_trail_version, on: [:update],
                  ignore: [:created_at, :updated_by_id, :updated_at, :version_independent_id, :published_by_id, :tag_list]

  has_many :question_response_sets, dependent: :destroy
  has_many :response_sets, through: :question_response_sets
  has_many :section_nested_items
  has_many :sections, through: :section_nested_items
  has_many :section_linked_response_sets, through: :section_nested_items, source: :response_set

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
  validates :oid, allow_blank: true, format: { with: /\A[\d.]+\z/, message: 'OID must be correct format' }

  after_destroy :update_sections

  after_commit :index, on: [:create, :update]
  after_commit :es_destroy, on: [:destroy]

  def es_destroy
    SDP::Elasticsearch.delete_item('question', id, true)
  end

  def exclusive_use?
    # Checking if the section that was just destroyed was the only linked section
    sections.empty?
  end

  def omb_approved?
    omb_flag = false
    sections.each { |s| omb_flag = true if s.omb_approved? }
    omb_flag
  end

  def update_sections
    section_array = sections.to_a
    section_nested_items.destroy_all
    section_array.each(&:update_item_positions)
  end

  def index
    UpdateIndexJob.perform_later('question', id)
  end

  def build_new_revision
    new_revision = Question.new(content: content, description: description, status: status,
                                version_independent_id: version_independent_id,
                                version: version + 1, question_response_sets: question_response_sets,
                                response_sets: response_sets, section_nested_items: section_nested_items, sections: sections,
                                category: category, oid: oid, parent_id: parent_id, subcategory: subcategory,
                                response_type: response_type)
    concepts.each do |c|
      new_revision.concepts << c.dup
    end

    new_revision
  end

  def potential_duplicates(current_user, date_filter = false)
    current_user_id = current_user ? current_user.id : nil
    current_user_groups = current_user ? current_user.groups : []
    results = SDP::Elasticsearch.find_duplicates(self, current_user_id, current_user_groups, date_filter)
    if results && results['hits'] && results['hits']['total'] > 0
      category_name = category ? category.name : ''
      rt = response_type ? response_type.name : ''
      { draft_question: { id: id, content: content, description: description, response_type: rt, status: status, content_stage: content_stage,
                          category: category_name, curated_at: curated_at }, potential_duplicates: results['hits']['hits'] }
    else
      false
    end
  end

  def enque_duplicate_finder(batch)
    batch.add_to_batch(self, :questions) do |results|
      if results && results['hits'] && results['hits']['total'] > 0
        category_name = category ? category.name : ''
        rt = response_type ? response_type.name : ''
        { draft_question: { id: id, content: content, description: description, response_type: rt, status: status, content_stage: content_stage,
                            category: category_name, curated_at: curated_at }, potential_duplicates: results['hits']['hits'] }
      else
        false
      end
    end
  end

  def mark_as_duplicate(replacement)
    section_nested_items.each do |sni|
      sni.question = replacement
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

  def cascading_action(&block)
    temp_rs = []
    response_sets.each { |rs| temp_rs << rs }
    yield self
    temp_rs.each { |rs| rs.cascading_action(&block) }
  end

  def linked_response_sets
    section_linked_response_sets.uniq
  end

  def parent_items
    parent_item_array = []
    sections.each do |sect|
      parent_item_array << { id: sect.id, name: sect.name, surveys: sect.surveys_with_path }
    end
    parent_item_array
  end

  # Get the programs that the section is associated with by the surveys that the
  # section is contained in
  def surveillance_programs
    SurveillanceProgram.joins(surveys: :survey_sections)
                       .joins('INNER join section_nested_items on section_nested_items.section_id = survey_sections.section_id')
                       .where('section_nested_items.question_id = ?', id).select(:id, :name).distinct.to_a
  end

  def surveillance_systems
    SurveillanceSystem.joins(surveys: :survey_sections)
                      .joins('INNER join section_nested_items on section_nested_items.section_id = survey_sections.section_id')
                      .where('section_nested_items.question_id = ?', id).select(:id, :name).distinct.to_a
  end

  def other_allowed_on_when_choice
    if other_allowed && (response_type.blank? || response_type.code != 'choice')
      errors.add(:other_allowed, "can't be true unless the response type is choice")
    end
  end
end
