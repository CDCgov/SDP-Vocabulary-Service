class Form < ApplicationRecord
  include OidGenerator, Versionable
  acts_as_commentable

  has_many :form_questions
  has_many :questions, through: :form_questions
  has_many :response_sets, through: :form_questions
  belongs_to :created_by, class_name: 'User'

  validates :created_by, presence: true
  validates :control_number, allow_blank: true, format: { with: /\d{4}-\d{4}/,
                                                          message: 'must be a valid OMB Control Number' },
                             uniqueness: { message: 'forms should have different OMB Control Numbers',
                                           unless: proc { |f| f.version > 1 && f.other_versions.map(&:control_number).include?(f.control_number) } }

  after_save do |form|
    UpdateIndexJob.perform_async('form', ESFormSerializer.new(form))
  end

  after_delete do |form|
    DeleteFromIndexJob.perform_async('form', form.id)
  end
  # Builds a new Form object with the same version_independent_id. Increments
  # the version by one and builds a new set of Response objects to go with it.
  def build_new_revision
    new_revision = Form.new(version_independent_id: version_independent_id,
                            version: version + 1, name: name, oid: oid,
                            created_by: created_by, control_number: control_number)

    new_revision
  end

  def omb_approved?
    control_number.present?
  end
end
