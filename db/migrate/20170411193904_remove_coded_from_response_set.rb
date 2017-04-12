class RemoveCodedFromResponseSet < ActiveRecord::Migration[5.0]
  def change
    remove_column :response_sets, :coded, :boolean
  end
end
