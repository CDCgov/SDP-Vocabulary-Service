class AddParentIdToResponseSets < ActiveRecord::Migration[5.0]
  def change
    add_column :response_sets, :parent_id, :integer
  end
end
