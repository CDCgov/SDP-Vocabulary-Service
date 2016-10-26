class CreateQuestionResponseSets < ActiveRecord::Migration[5.0]
  def change
    create_table :question_response_sets do |t|
      t.integer :question_id
      t.integer :response_set_id

      t.timestamps
    end

    Question.find_each do |t|
      # Preserve previous links
      QuestionResponseSet.create(question_id: t.id, response_set_id: t.response_set_id)
    end
  end
end
