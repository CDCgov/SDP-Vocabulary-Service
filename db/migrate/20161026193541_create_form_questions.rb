class CreateFormQuestions < ActiveRecord::Migration[5.0]
  def change
    create_table :form_questions do |t|
      t.integer :form_id
      t.integer :question_id
      t.integer :response_set_id

      t.timestamps
    end
  end
end
