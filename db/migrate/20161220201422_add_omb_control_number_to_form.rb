class AddOmbControlNumberToForm < ActiveRecord::Migration[5.0]
  def change
    add_column :forms, :control_number, :string, limit: 9
  end
end
