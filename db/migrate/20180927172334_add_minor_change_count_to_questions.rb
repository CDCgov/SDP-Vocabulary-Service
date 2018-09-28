class AddMinorChangeCountToQuestions < ActiveRecord::Migration[5.1]
  def change
    add_column :response_sets, :minor_change_count, :integer, default: 0
    add_column :questions, :minor_change_count, :integer, default: 0
    add_column :sections, :minor_change_count, :integer, default: 0
    add_column :surveys, :minor_change_count, :integer, default: 0
  end
end
