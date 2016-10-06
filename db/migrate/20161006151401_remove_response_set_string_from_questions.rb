class RemoveResponseSetStringFromQuestions < ActiveRecord::Migration[5.0]
  def change
    remove_column :questions, :response_set_string, :string
  end
end
