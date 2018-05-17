class AddDuplicatesReplacedCountToQuestionAndResponseSet < ActiveRecord::Migration[5.1]
  def change
    add_column :questions, :duplicates_replaced_count, :integer, default: 0
    add_column :response_sets, :duplicates_replaced_count, :integer, default: 0
  end
end
