class ResponseSet < ApplicationRecord
  has_many :questions
  has_many :responses, dependent: :nullify
  # Just adding this until we confirm we want to replace these with an intermediate model
  # instead of a join table
  # rubocop:disable Rails/HasAndBelongsToMany
  has_and_belongs_to_many :concepts
  # rubocop:enable Rails/HasAndBelongsToMany
end
