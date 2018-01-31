# rubocop:disable Rails/HasAndBelongsToMany
module Groupable
  extend ActiveSupport::Concern

  included do
    has_and_belongs_to_many :groups, as: :groupable
  end

  def not_owned_or_in_group?(current_user)
    all_versions.last.created_by != current_user && (all_versions.last.group_ids & current_user.group_ids).empty?
  end

  def add_to_group(gid)
    cascading_action do |element|
      element.groups << Group.find(gid)
      UpdateIndexJob.perform_later(element.class.to_s.downcase, id)
    end
  end

  def remove_from_group(gid)
    cascading_action do |element|
      element.groups.delete(Group.find(gid))
      UpdateIndexJob.perform_later(element.class.to_s.downcase, id)
    end
  end
end
# rubocop:enable Rails/HasAndBelongsToMany
