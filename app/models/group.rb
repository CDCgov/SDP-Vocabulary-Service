# rubocop:disable Rails/HasAndBelongsToMany
class Group < ApplicationRecord
  has_and_belongs_to_many :users
  validates :name, uniqueness: true, case_sensitive: false

  def add_user(user)
    users << user
  end

  def remove_user(user)
    users.delete(user)
  end
end
# rubocop:enable Rails/HasAndBelongsToMany
