class CreateDataCollectionMethods < ActiveRecord::Migration[5.1]
  def change
    add_column :questions, :data_collection_methods, :string, array: true, default: []
  end
end
