class AddSurveyModels < ActiveRecord::Migration[5.0]
  def change
    create_table :surveys do |t|
      t.string :name
      t.timestamps
      t.references :created_by, foreign_key: { to_table: :users }
      t.string   :version_independent_id
      t.integer  :version, default: 1
      t.string   :control_number, limit: 9
    end

    create_table :survey_forms do |t|
      t.integer :survey_id
      t.integer :form_id
      t.integer :position
    end
  end
end
