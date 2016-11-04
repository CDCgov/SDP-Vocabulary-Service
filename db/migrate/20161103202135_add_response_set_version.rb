class AddResponseSetVersion < ActiveRecord::Migration[5.0]
  def up
    add_column :response_sets, :version_independent_id, :integer
    add_column :response_sets, :version, :integer, default: 1

    ResponseSet.all.each_with_index do |rs, i|
      rs.update_attribute :version_independent_id, i
    end
  end

  def down
    remove_column :response_sets, :version_independent_id
    remove_column :response_sets, :version
  end
end
