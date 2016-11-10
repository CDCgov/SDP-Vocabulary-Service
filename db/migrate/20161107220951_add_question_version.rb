class AddQuestionVersion < ActiveRecord::Migration[5.0]
  def up
    add_column :questions, :version_independent_id, :string
    add_column :questions, :version, :integer, default: 1

    Question.all.each_with_index do |q, _i|
      q.update_attribute :version_independent_id, "Q-#{q.id}"
    end
  end

  def down
    remove_column :questions, :version_independent_id
    remove_column :questions, :version
  end
end
