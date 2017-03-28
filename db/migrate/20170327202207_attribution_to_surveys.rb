class AttributionToSurveys < ActiveRecord::Migration[5.0]
  def change
    remove_foreign_key :forms, :surveillance_programs
    remove_column :forms, :surveillance_program_id
    remove_foreign_key :forms, :surveillance_systems
    remove_column :forms, :surveillance_system_id

    add_column :surveys, :surveillance_program_id, :integer
    add_foreign_key :surveys, :surveillance_programs
    add_column :surveys, :surveillance_system_id, :integer
    add_foreign_key :surveys, :surveillance_systems
  end
end
