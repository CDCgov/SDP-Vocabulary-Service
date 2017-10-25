class RemoveControlNumberFromSection < ActiveRecord::Migration[5.1]
  def change
    remove_column :sections, :control_number, :string, limit: 9
  end
end
