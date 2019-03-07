class AddSuggestedReplacementOfToQuestions < ActiveRecord::Migration[5.1]
  def change
    add_column :questions, :suggested_replacement_of, :string
  end
end
