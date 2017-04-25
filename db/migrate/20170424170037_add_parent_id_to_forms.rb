class AddParentIdToForms < ActiveRecord::Migration[5.0]
  def change
    add_column :forms, :parent_id, :integer
  end
end
