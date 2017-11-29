# rubocop:disable Rails/HasAndBelongsToMany
module Groupable
  extend ActiveSupport::Concern

  included do
    has_and_belongs_to_many :groups, as: :groupable
  end

  def add_to_group(id)
    groups << Group.find(id)
  end
end
# rubocop:enable Rails/HasAndBelongsToMany
