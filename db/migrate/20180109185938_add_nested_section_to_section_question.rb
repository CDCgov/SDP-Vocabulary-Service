class AddNestedSectionToSectionQuestion < ActiveRecord::Migration[5.1]
  def up
    add_reference :section_questions, :nested_section
    rename_table :section_questions, :section_nested_items
  end

  def down
    rename_table :section_nested_items, :section_questions
    remove_reference :section_questions, :nested_section
  end
end
