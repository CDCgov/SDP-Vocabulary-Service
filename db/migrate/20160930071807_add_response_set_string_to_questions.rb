class AddResponseSetStringToQuestions < ActiveRecord::Migration[5.0]
  def change
    add_column :questions, :response_set_string, :string
  end
end
