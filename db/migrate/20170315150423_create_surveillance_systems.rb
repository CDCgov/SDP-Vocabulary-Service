class CreateSurveillanceSystems < ActiveRecord::Migration[5.0]
  def change
    create_table :surveillance_systems do |t|
      t.string :name
      t.string :description
      t.string :acronym

      t.timestamps
    end
  end
end
