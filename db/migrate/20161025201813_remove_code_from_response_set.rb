class RemoveCodeFromResponseSet < ActiveRecord::Migration[5.0]
  def change
    remove_column :response_sets, :code, :string
    remove_column :response_sets, :code_system, :string
    add_column :responses, :code_system, :string
  end
end
