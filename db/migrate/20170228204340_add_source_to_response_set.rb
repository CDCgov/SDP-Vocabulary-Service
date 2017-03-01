class AddSourceToResponseSet < ActiveRecord::Migration[5.0]
  def change
    add_column :response_sets, :source, :string, default: 'local'
    ResponseSet.update_all(source: 'local')
  end
end
