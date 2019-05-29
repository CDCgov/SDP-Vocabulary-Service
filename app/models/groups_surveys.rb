# rubocop:disable Rails/HasAndBelongsToMany
class GroupsSurveys < ApplicationRecord
  has_and_belongs_to_many :surveys
end
# rubocop:enable Rails/HasAndBelongsToMany
