class AddQuestionVersion < ActiveRecord::Migration[5.0]
  def up
    add_column :questions, :version_independent_id, :integer
    add_column :questions, :version, :integer, default: 1

    Question.all.each_with_index do |q, i|
      q.update_attribute :version_independent_id, q.id
    end
  end

  def down
    remove_column :questions, :version_independent_id
    remove_column :questions, :version
  end
end
