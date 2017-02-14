class AddDescriptionAndStatusToModels < ActiveRecord::Migration[5.0]
  def change
    add_column :forms, :description, :text
    add_column :forms, :status, :string
    add_column :questions, :description, :text
    add_column :questions, :status, :string
  end
end
