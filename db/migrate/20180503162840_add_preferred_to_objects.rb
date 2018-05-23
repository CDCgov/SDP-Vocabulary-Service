class AddPreferredToObjects < ActiveRecord::Migration[5.1]
  def change
    add_column :surveys, :preferred, :boolean
    add_column :sections, :preferred, :boolean
    add_column :questions, :preferred, :boolean
    add_column :response_sets, :preferred, :boolean
  end
end
