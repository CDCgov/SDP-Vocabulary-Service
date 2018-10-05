class AddAssociationsToVersions < ActiveRecord::Migration[5.1]
  def change
    add_column :versions, :associations, :hstore, default: {}
  end
end
