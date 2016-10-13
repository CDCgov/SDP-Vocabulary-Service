class Concept < ApplicationRecord
  # rubocop:disable Rails/HasAndBelongsToMany
  has_and_belongs_to_many :response_sets
  # rubocop:enable Rails/HasAndBelongsToMany
end
