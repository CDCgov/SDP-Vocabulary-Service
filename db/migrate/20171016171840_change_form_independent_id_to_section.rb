class ChangeFormIndependentIdToSection < ActiveRecord::Migration[5.1]
  def up
    Section.all.each do |s|
      old_vid = s.version_independent_id || "SECT-#{s.id}"
      vid = old_vid.gsub('F', 'SECT')
      s.update_attribute :version_independent_id, vid
    end
  end

  def down
    Section.all.each do |s|
      old_vid = s.version_independent_id || "SECT-#{s.id}"
      vid = old_vid.gsub('SECT', 'F')
      s.update_attribute :version_independent_id, vid
    end
  end
end
