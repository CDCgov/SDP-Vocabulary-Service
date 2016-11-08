class ResponseSet < ApplicationRecord
  has_many :question_response_sets
  has_many :questions, through: :question_response_sets
  has_many :responses, dependent: :nullify
  has_many :form_questions
  has_many :forms, through: :form_questions
  belongs_to :created_by, class_name: 'User'
  belongs_to :updated_by, class_name: 'User'
  accepts_nested_attributes_for :responses, allow_destroy: true

  validates :version_independent_id, presence: true,
                                     if: proc { |rs| rs.version > 1 }
  validates :version, presence: true, uniqueness: { scope: :version_independent_id,
                                                    message: 'versions should be unique across a revised response set' }

  after_save :assign_version_independent_id,
             if: proc { |rs| rs.version == 1 && rs.version_independent_id.blank? }

  # Finds only the latest versions of ResponseSets. ResponseSet.all will return
  # all versions of all ResponseSets.
  def self.latest_versions
    joins('INNER JOIN (SELECT version_independent_id, MAX(version) as version
             FROM response_sets GROUP BY version_independent_id) rs
             ON rs.version_independent_id = response_sets.version_independent_id
             AND response_sets.version = rs.version')
  end

  # Callback that assigns the version_independent_id. This should never be called
  # directly.
  def assign_version_independent_id
    if version == 1
      update_attribute(:version_independent_id, "RS-#{id}")
    else
      # If you have a ResponseSet with a version greater than 1, it should
      # already have a version_independent_id set.
      raise ActiveRecord::RecordInvalid, self
    end
  end

  # Builds a new ResponseSet object with the same version_independent_id. Increments
  # the version by one and builds a new set of Response objects to go with it.
  def build_new_revision
    new_revision = ResponseSet.new(version_independent_id: version_independent_id,
                                   version: version + 1, description: description,
                                   name: name, coded: coded, oid: oid)
    responses.each do |r|
      new_revision.responses << r.dup
    end

    new_revision
  end

  # Finds any other versions of this ResponseSet in descending version order
  def other_versions
    ResponseSet.where(version_independent_id: version_independent_id)
               .where.not(version: version)
               .order(version: :desc)
  end
end
