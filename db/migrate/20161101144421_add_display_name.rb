class AddDisplayName < ActiveRecord::Migration[5.0]
  def change
    add_column :responses, :display_name, :string
    add_column :response_sets, :coded, :boolean
  end
end
