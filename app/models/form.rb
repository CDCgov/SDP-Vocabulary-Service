class Form < ApplicationRecord
  has_many :form_questions
  has_many :questions, through: :form_questions
  has_many :response_sets, through: :form_questions
  belongs_to :created_by, class_name: 'User'
end
