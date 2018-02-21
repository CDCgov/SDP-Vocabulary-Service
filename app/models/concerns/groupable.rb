# rubocop:disable Rails/HasAndBelongsToMany
module Groupable
  extend ActiveSupport::Concern

  included do
    has_and_belongs_to_many :groups, as: :groupable
  end

  def not_owned_or_in_group?(current_user)
    all_versions.last.created_by != current_user && (all_versions.last.group_ids & current_user.group_ids).empty?
  end

  def prev_not_owned_or_in_group?(current_user)
    if version > 1
      prev_version = self.class.find_by(version_independent_id: version_independent_id,
                                        version: version - 1)
      errors.add(:version, 'previous version not found') if prev_version.nil?
      prev_version.created_by != current_user && (prev_version.group_ids & current_user.group_ids).empty?
    else
      false
    end
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
