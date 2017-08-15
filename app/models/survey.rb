class Survey < ApplicationRecord
  include Versionable, Searchable
  acts_as_commentable

  has_many :survey_forms, -> { order 'position asc' }, dependent: :destroy
  has_many :forms, through: :survey_forms

  belongs_to :created_by, class_name: 'User'
  belongs_to :published_by, class_name: 'User'
  belongs_to :parent, class_name: 'Survey'
  belongs_to :surveillance_system
  belongs_to :surveillance_program

  validates :name, presence: true
  validates :created_by, presence: true
  validates :control_number, allow_blank: true, format: { with: /\A\d{4}-\d{4}\z/,
                                                          message: 'must be a valid OMB Control Number' },
                             uniqueness: { message: 'forms should have different OMB Control Numbers',
                                           unless: proc { |f| f.version > 1 && f.other_versions.map(&:control_number).include?(f.control_number) } }

  accepts_nested_attributes_for :forms, allow_destroy: true

  after_commit :index, on: [:create, :update]
  after_commit :delete_index, on: :destroy

  def questions
    Question.joins(form_questions: { form: { survey_forms: :survey } }).where(surveys: { id: id }).all
  end

  def index
    UpdateIndexJob.perform_later('survey', self)
  end

  def delete_index
    DeleteFromIndexJob.perform_later('survey', id)
  end

  def remove_form(deleted_form_id)
    SurveyForm.transaction do
      i = 0
      survey_forms.each do |sf|
        if sf.form_id == deleted_form_id
          sf.destroy!
        else
          # Avoiding potential unecessary writes
          if sf.position != i
            sf.position = i
            sf.save!
          end
          i += 1
        end
      end
    end
  end

  def publish(publisher)
    if status == 'draft'
      self.status = 'published'
      self.published_by = publisher
      save!
    end
    forms.each { |f| f.publish(publisher) }
  end

  def build_new_revision
    new_revision = Survey.new(version_independent_id: version_independent_id,
                              name: name, parent_id: parent_id,
                              version: version + 1, status: status,
                              created_by: created_by, control_number: control_number)

    new_revision
  end
end
