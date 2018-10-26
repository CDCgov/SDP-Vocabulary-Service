class RenameTaggableToMappable < ActiveRecord::Migration[5.1]
  def change
    rename_column :concepts, :taggable_id, :mappable_id
    rename_column :concepts, :taggable_type, :mappable_type
  end
end
