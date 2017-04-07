class CreateSurveillancePrograms < ActiveRecord::Migration[5.0]
  def change
    create_table :surveillance_programs do |t|
      t.string :name
      t.string :description
      t.string :acronym

      t.timestamps
    end

    add_index :surveillance_programs, :name, unique: true
  end
end
