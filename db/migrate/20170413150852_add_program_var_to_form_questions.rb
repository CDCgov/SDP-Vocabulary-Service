class AddProgramVarToFormQuestions < ActiveRecord::Migration[5.0]
  def change
    add_column :form_questions, :program_var, :string
  end
end
