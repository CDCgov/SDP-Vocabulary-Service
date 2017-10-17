class RenameFormsToSections < ActiveRecord::Migration[5.1]
  def change
    rename_table :forms, :sections
    rename_table :form_questions, :section_questions
    rename_column :section_questions, :form_id, :section_id
    rename_table :survey_forms, :survey_sections
    rename_column :survey_sections, :form_id, :section_id
  end
end
