class AddResponseSetVersion < ActiveRecord::Migration[5.0]
  def up
    add_column :response_sets, :version_independent_id, :string
    add_column :response_sets, :version, :integer, default: 1

    ResponseSet.all.each do |rs|
      rs.update_attribute :version_independent_id, "RS-#{rs.id}"
    end
  end

  def down
    remove_column :response_sets, :version_independent_id
    remove_column :response_sets, :version
  end
end
