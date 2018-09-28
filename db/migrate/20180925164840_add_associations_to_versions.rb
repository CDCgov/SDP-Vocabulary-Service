class AddAssociationsToVersions < ActiveRecord::Migration[5.1]
  def change
    enable_extension 'hstore'
    add_column :versions, :associations, :hstore, default: {}
  end
end
