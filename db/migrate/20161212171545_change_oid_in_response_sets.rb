class ChangeOidInResponseSets < ActiveRecord::Migration[5.0]
  def change
    change_column :response_sets, :oid, :string
  end
end
