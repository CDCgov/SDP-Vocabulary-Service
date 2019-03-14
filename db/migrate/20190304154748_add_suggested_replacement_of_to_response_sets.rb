class AddSuggestedReplacementOfToResponseSets < ActiveRecord::Migration[5.1]
  def change
    add_column :response_sets, :suggested_replacement_of, :string
  end
end
