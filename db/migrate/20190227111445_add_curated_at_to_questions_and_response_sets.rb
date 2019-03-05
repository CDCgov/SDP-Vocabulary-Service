class AddCuratedAtToQuestionsAndResponseSets < ActiveRecord::Migration[5.1]
  def change
    add_column :questions, :curated_at, :datetime
    add_column :response_sets, :curated_at, :datetime
  end
end
