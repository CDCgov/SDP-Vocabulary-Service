class AddImportWarningsToImportSession < ActiveRecord::Migration[5.1]
  def change
    add_column :import_sessions, :import_warnings, :string, array:true
  end
end
