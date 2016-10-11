class Question < ApplicationRecord
  belongs_to :response_set
  belongs_to :question_type
  validates :question_type_id, presence: true
end
