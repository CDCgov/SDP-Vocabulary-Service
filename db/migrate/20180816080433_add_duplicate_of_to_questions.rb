class AddDuplicateOfToQuestions < ActiveRecord::Migration[5.1]
  def change
    add_column :questions, :duplicate_of, :integer
    add_column :response_sets, :duplicate_of, :integer
  end
end
