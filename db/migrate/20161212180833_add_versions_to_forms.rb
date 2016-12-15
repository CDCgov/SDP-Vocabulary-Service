class AddVersionsToForms < ActiveRecord::Migration[5.0]
  def up
    add_column :forms, :version_independent_id, :string
    add_column :forms, :version, :integer, default: 1

    Form.all.each do |f|
      f.update_attribute :version_independent_id, "F-#{f.id}"
    end
  end

  def down
    remove_column :forms, :version_independent_id
    remove_column :forms, :version
  end
end
