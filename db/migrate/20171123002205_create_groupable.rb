class CreateGroupable < ActiveRecord::Migration[5.1]
  def change
    create_join_table :groups, :questions do |t|
      t.index [:group_id, :question_id]
    end

    create_join_table :groups, :response_sets do |t|
      t.index [:group_id, :response_set_id]
    end

    create_join_table :groups, :sections do |t|
      t.index [:group_id, :section_id]
    end

    create_join_table :groups, :surveys do |t|
      t.index [:group_id, :survey_id]
    end
  end
end
