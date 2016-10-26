class AddUsersToQuestions < ActiveRecord::Migration[5.0]
  def change
    add_reference :questions, :created_by, foreign_key: { to_table: :users }
    add_reference :questions, :updated_by, foreign_key: { to_table: :users }
    remove_column :questions, :author, :string
    add_reference :response_sets, :created_by, foreign_key: { to_table: :users }
    add_reference :response_sets, :updated_by, foreign_key: { to_table: :users }
    remove_column :response_sets, :author, :string
  end
end
