class RenameTagsToConcepts < ActiveRecord::Migration[5.1]
  def change
    rename_table :tags, :concepts
  end
end
