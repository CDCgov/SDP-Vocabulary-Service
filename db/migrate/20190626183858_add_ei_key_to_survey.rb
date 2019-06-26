class AddEiKeyToSurvey < ActiveRecord::Migration[5.1]
  def change
    add_column :surveys, :ei_pub_key, :string
    add_column :surveys, :ei_org_key, :string
    add_column :surveys, :ei_url, :string
  end
end
