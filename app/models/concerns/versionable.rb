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

    attr_accessor :_all_versions
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

  def other_versions
    all_versions.reject { |v| v.version == version }
  end

  def all_versions
    @_all_versions ||= self.class.where(version_independent_id: version_independent_id)
                           .order(version: :desc)
  end

  def most_recent
    latest_version = nil
    latest_version = max_version if respond_to?(:max_version)
    if latest_version.nil? && other_versions.present?
      latest_version = other_versions[0].version
    end
    latest_version ||= 1
    if latest_version >= version
      latest_version
    else
      version
    end
  end

  def most_recent?
    most_recent == version
  end

  def most_recent_published
    mrv = nil
    mrv = most_recent_version if respond_to?(:most_recent_version)
    if mrv.nil? && other_versions.present?
      mrv_obj = all_versions[0]
      if mrv_obj.present? && mrv_obj.status == 'published'
        most_recent
      elsif mrv_obj.present? && mrv_obj.version > 1
        most_recent - 1
      end
    else
      mrv
    end
  end

  def most_recent_published?
    most_recent_published == version
  end

  def as_json(options = {})
    super((options || {}).merge(methods: [:most_recent]))
  end

  class_methods do
    def latest_versions
      joins("INNER JOIN (SELECT version_independent_id, MAX(version) as version
               FROM #{table_name} GROUP BY version_independent_id) tn
               ON tn.version_independent_id = #{table_name}.version_independent_id
               AND #{table_name}.version = tn.version")
    end

    def last_published
      latest_versions.where("status = 'published'")
    end

    def by_id_and_version(id, version = nil)
      if version
        find_by(version_independent_id: id, version: version)
      else
        object = find_by(version_independent_id: id)
        if !object.nil?
          latest_version = object.most_recent
          find_by(version_independent_id: id, version: latest_version)
        else
          return nil
        end
      end
    end
  end
end
