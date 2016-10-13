class ResponseSet < ApplicationRecord
  has_many :questions
  has_many :responses, dependent: :nullify
  # rubocop:disable Rails/HasAndBelongsToMany
  has_and_belongs_to_many :concepts
  # rubocop:enable Rails/HasAndBelongsToMany
end
