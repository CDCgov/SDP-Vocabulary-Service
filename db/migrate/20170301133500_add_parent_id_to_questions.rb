class AddParentIdToQuestions < ActiveRecord::Migration[5.0]
  def change
    add_column :questions, :parent_id, :integer
  end
end
