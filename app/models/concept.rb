class Concept < ApplicationRecord
  # Just adding this until we confirm we want to replace these with an intermediate model
  # instead of a join table
  # rubocop:disable Rails/HasAndBelongsToMany
  has_and_belongs_to_many :response_sets
  # rubocop:enable Rails/HasAndBelongsToMany
end
