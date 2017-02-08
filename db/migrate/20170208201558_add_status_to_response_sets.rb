class AddStatusToResponseSets < ActiveRecord::Migration[5.0]
  def change
    add_column :response_sets, :status, :string
  end
end
