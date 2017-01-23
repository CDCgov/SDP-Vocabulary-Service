module OidGenerator
  extend ActiveSupport::Concern

  if Settings.oid_prefix.blank? ||
     Settings.oid_prefix['Form'].blank? ||
     Settings.oid_prefix['Question'].blank? ||
     Settings.oid_prefix['ResponseSet'].blank?
    raise 'OID prefixes misconfigured, cannot continue. Configure these prefixes in config/settings.yml'
  end

  included do
    validate :validate_oid
    after_save :assign_oid, if: proc { |r| r.oid.blank? }
  end

  # Callback that assigns the oid. This should never be called directly.
  def assign_oid
    if version > 1
      # If not first version, set the oid to whatever the parent's oid was, even if that means it will be blank
      parent_oid = self.class.where(version_independent_id: version_independent_id, version: 1)
                       .limit(1)
                       .pluck(:oid)
                       .first
      update_attribute(:oid, parent_oid)
    else
      new_oid = "#{self.class.oid_prefix}.#{id}"
      if self.class.where(oid: new_oid).count > 0
        new_oid = self.class.next_avail_oid(id)
      end
      update_attribute(:oid, new_oid)
    end
  end

  # If oid exists, check if oid is unique for all records that are NOT a different version of the same record
  def validate_oid
    return if oid.blank?
    conflicts = if version == 1
                  self.class.where.not(id: id).where(oid: oid).count
                else
                  self.class.where.not(version_independent_id: version_independent_id).where(oid: oid).count
                end
    if conflicts > 0
      errors.add(:oid, "Cannot save #{self.class.name} record, OID already in use")
    end
  end

  module ClassMethods
    def oid_prefix
      Settings.oid_prefix[name]
    end

    def next_avail_oid(start_oid = 1)
      oid_list = where("oid LIKE ?  AND split_part(oid, '.', 9)::int > ?", "%#{oid_prefix}%", start_oid)
                 .order("split_part(oid, '.', 9)::int ASC")
                 .pluck(:oid)
      next_oid = start_oid + 1
      oid_list.each do |oid|
        current = oid.split('.').last.to_i
        break if next_oid != current
        next_oid += 1
      end
      "#{oid_prefix}.#{next_oid}"
    end
  end
end
