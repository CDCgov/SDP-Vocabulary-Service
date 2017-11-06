class Subcategory < ApplicationRecord
  validates :name, presence: true
  belongs_to :category
  has_many :questions, dependent: :nullify
end
