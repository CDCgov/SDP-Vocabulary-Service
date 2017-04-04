class AddOtherToQuestion < ActiveRecord::Migration[5.0]
  def change
    add_column :questions, :other_allowed, :boolean
  end
end
