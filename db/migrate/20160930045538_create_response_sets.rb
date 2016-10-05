class CreateResponseSets < ActiveRecord::Migration[5.0]
  def change
    create_table :response_sets do |t|
      t.string :name
      t.text :description
      t.integer :oid
      t.string :author
      t.string :code
      t.string :code_system

      t.timestamps
    end
  end
end
