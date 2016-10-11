class AddQuestionTypeToQuestion < ActiveRecord::Migration[5.0]
  def change
    add_reference :questions, :question_type, foreign_key: true
  end
end
