class CreateCodedConcepts < ActiveRecord::Migration[5.0]
  def change
    create_table :concepts do |t|
      t.text :value
      t.string :code_system
      t.string :display_name
      t.references :question, foreign_key: true

      t.timestamps
    end
  end
end
