class QuestionType < ApplicationRecord
  validates :name, presence: true
  has_many :questions, dependent: :nullify
  has_many :subcategories, dependent: :destroy
end
