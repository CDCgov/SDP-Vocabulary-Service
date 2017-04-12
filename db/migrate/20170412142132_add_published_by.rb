class AddPublishedBy < ActiveRecord::Migration[5.0]
  def change
    add_column :surveys, :published_by_id, :integer
    add_foreign_key :surveys, :users, column: :published_by_id

    add_column :forms, :published_by_id, :integer
    add_foreign_key :forms, :users, column: :published_by_id

    add_column :questions, :published_by_id, :integer
    add_foreign_key :questions, :users, column: :published_by_id

    add_column :response_sets, :published_by_id, :integer
    add_foreign_key :response_sets, :users, column: :published_by_id
  end
end
