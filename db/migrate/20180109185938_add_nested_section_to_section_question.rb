class AddNestedSectionToSectionQuestion < ActiveRecord::Migration[5.1]
  def change
    add_reference :section_questions, :nested_section
  end
end
