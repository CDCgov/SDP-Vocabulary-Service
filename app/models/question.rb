class Question < ApplicationRecord
  has_many :question_response_sets
  has_many :response_sets, through: :question_response_sets
  has_many :form_questions
  has_many :forms, through: :form_questions
  belongs_to :question_type
  belongs_to :created_by, class_name: 'User'
  belongs_to :updated_by, class_name: 'User'
  validates :question_type_id, presence: true
end
