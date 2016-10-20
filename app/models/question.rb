class Question < ApplicationRecord
  has_many :question_response_sets
  has_many :response_sets, through: :question_response_sets
  belongs_to :question_type
  validates :question_type_id, presence: true
end
