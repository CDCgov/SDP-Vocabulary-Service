class AddOidToQuestionsAndForms < ActiveRecord::Migration[5.0]
  def change
    add_column :questions, :oid, :string
    add_column :forms, :oid, :string
  end
end
