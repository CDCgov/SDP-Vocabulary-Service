class Subcategory < ApplicationRecord
  validates :name, presence: true
  belongs_to :question_type
  has_many :questions, dependent: :nullify
end
