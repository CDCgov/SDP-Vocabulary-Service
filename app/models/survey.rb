class Survey < ApplicationRecord
  include Versionable
  has_many :survey_forms
  belongs_to :created_by, class_name: 'User'

  has_many :forms, through: :survey_forms

  validates :created_by, presence: true
  validates :control_number, allow_blank: true, format: { with: /\d{4}-\d{4}/,
                                                          message: 'must be a valid OMB Control Number' },
                             uniqueness: { message: 'forms should have different OMB Control Numbers',
                                           unless: proc { |f| f.version > 1 && f.other_versions.map(&:control_number).include?(f.control_number) } }

  accepts_nested_attributes_for :forms, allow_destroy: true

  after_commit :index, on: [:create, :update]
  after_commit :delete_index, on: :destroy

  def index
    UpdateIndexJob.perform_later('survey', ESSurveySerializer.new(self).as_json)
  end

  def delete_index
    DeleteFromIndexJob.perform_later('survey', id)
  end

  def self.search(search = nil, current_user_id = nil)
    if current_user_id && search
      where("(status='published' OR created_by_id= ?) AND (name ILIKE ?)", current_user_id, "%#{search}%")
    elsif current_user_id
      where("(status= 'published' OR created_by_id = ?)", current_user_id)
    elsif search
      where('status= ? and name ILIKE ?', 'published', "%#{search}%")
    else
      where('status=  ?', 'published')
    end
  end

  def build_new_revision
    new_revision = Survey.new(version_independent_id: version_independent_id,
                              name: name,
                              version: version + 1,
                              created_by: created_by, control_number: control_number)

    new_revision
  end
end
