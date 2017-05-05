class AddParentIdToSurveys < ActiveRecord::Migration[5.0]
  def change
    add_column :surveys, :parent_id, :integer
  end
end
