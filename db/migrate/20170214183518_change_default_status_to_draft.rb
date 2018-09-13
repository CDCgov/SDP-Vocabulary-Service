class ChangeDefaultStatusToDraft < ActiveRecord::Migration[5.0]
  def change
    change_column_default(:forms, :status, 'draft')
    change_column_default(:questions, :status, 'draft')
    change_column_default(:response_sets, :status, 'draft')
  end
end
