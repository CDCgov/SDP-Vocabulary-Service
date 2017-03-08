class AddPositionToFormQuestion < ActiveRecord::Migration[5.0]
  def change
    add_column :form_questions, :position, :integer
  end
end
