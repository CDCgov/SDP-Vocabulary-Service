module Versionable
  extend ActiveSupport::Concern

  included do
    validates :version_independent_id, presence: true,
                                       if: proc { |v| v.version > 1 }
    validates :version, presence: true,
                        uniqueness: { scope:   :version_independent_id,
                                      message: 'versions should be unique' }

    after_save :assign_version_independent_id,
               if: proc { |v| v.version == 1 && v.version_independent_id.blank? }
  end

  # Callback that assigns the version_independent_id. This should never be called
  # directly.
  def assign_version_independent_id
    if version == 1
      id_prefix = self.class.name.gsub(/[a-z]/, '')
      update_attribute(:version_independent_id, "#{id_prefix}-#{id}")
    else
      # If you have a record with a version greater than 1, it should
      # already have a version_independent_id set.
      raise ActiveRecord::RecordInvalid, self
    end
  end

  # Finds any other versions of this ResponseSet in descending version order
  def other_versions
    self.class.where(version_independent_id: version_independent_id)
        .where.not(version: version)
        .order(version: :desc)
  end

  def all_versions
    self.class.where(version_independent_id: version_independent_id)
        .order(version: :desc)
  end

  def most_recent
    if other_versions.present?
      if other_versions[0].version > version
        other_versions[0].version
      else
        version
      end
    else
      version
    end
  end

  def most_recent?
    if other_versions.present?
      if other_versions[0].version > version
        false
      else
        true
      end
    else
      true
    end
  end

  class_methods do
    def latest_versions
      joins("INNER JOIN (SELECT version_independent_id, MAX(version) as version
               FROM #{table_name} GROUP BY version_independent_id) tn
               ON tn.version_independent_id = #{table_name}.version_independent_id
               AND #{table_name}.version = tn.version")
    end

    def by_id_and_version(id, version = nil)
      if version
        find_by(version_independent_id: id, version: version)
      else
        latest_version = find_by(version_independent_id: id).most_recent
        find_by(version_independent_id: id, version: latest_version)
      end
    end
  end
end
