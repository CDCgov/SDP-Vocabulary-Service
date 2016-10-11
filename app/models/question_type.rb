class QuestionType < ApplicationRecord
  validates :name, presence: true
  has_many :questions, dependent: :nullify
end
