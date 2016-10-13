class CreateConceptsResponseSets < ActiveRecord::Migration[5.0]
  def change
    create_table :concepts_response_sets do |t|
      t.integer :concept_id
      t.integer :response_set_id
    end
  end
end
