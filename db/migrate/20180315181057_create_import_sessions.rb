class CreateImportSessions < ActiveRecord::Migration[5.1]
  def change
    create_table :import_sessions do |t|
      t.binary 'spreadsheet'
      t.string 'import_errors', array: true
      t.string 'original_filename'
      t.boolean 'request_survey_creation'
      t.integer 'top_level_sections'
      t.integer 'created_by_id'
      t.integer 'survey_id'
      t.timestamps
    end
  end
end
