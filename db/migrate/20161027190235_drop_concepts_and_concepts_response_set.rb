class DropConceptsAndConceptsResponseSet < ActiveRecord::Migration[5.0]
  def change
    drop_table :concepts
    drop_table :concepts_response_sets
  end
end
