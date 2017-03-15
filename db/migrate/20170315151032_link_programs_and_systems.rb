class LinkProgramsAndSystems < ActiveRecord::Migration[5.0]
  def change
    add_column :forms, :surveillance_program_id, :integer
    add_foreign_key :forms, :surveillance_programs
    add_column :forms, :surveillance_system_id, :integer
    add_foreign_key :forms, :surveillance_systems

    add_column :users, :last_program_id, :integer
    add_foreign_key :users, :surveillance_programs, column: :last_program_id
    add_column :users, :last_system_id, :integer
    add_foreign_key :users, :surveillance_systems, column: :last_system_id
  end
end
