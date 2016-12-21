class Form < ApplicationRecord
  include Versionable
  acts_as_commentable

  has_many :form_questions
  has_many :questions, through: :form_questions
  has_many :response_sets, through: :form_questions
  belongs_to :created_by, class_name: 'User'

  # Builds a new Form object with the same version_independent_id. Increments
  # the version by one and builds a new set of Response objects to go with it.
  def build_new_revision
    new_revision = Form.new(version_independent_id: version_independent_id,
                            version: version + 1, name: name)
    new_revision
  end
end
