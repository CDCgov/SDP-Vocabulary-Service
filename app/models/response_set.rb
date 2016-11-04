class ResponseSet < ApplicationRecord
  has_many :question_response_sets
  has_many :questions, through: :question_response_sets
  has_many :responses, dependent: :nullify
  has_many :form_questions
  has_many :forms, through: :form_questions
  belongs_to :created_by, class_name: 'User'
  belongs_to :updated_by, class_name: 'User'
  accepts_nested_attributes_for :responses, allow_destroy: true

  def self.latest_versions
    joins("INNER JOIN (SELECT version_independent_id, MAX(version) as version
             FROM response_sets GROUP BY version_independent_id) rs
             ON rs.version_independent_id = response_sets.version_independent_id
             AND response_sets.version = rs.version")
  end
end
