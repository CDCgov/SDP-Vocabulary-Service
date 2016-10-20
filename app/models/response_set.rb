class ResponseSet < ApplicationRecord
  has_many :question_response_sets
  has_many :questions, through: :question_response_sets
  has_many :responses, dependent: :nullify
  # rubocop:disable Rails/HasAndBelongsToMany
  has_and_belongs_to_many :concepts
  # rubocop:enable Rails/HasAndBelongsToMany
end
