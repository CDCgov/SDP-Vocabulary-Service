class RemoveHarmonizedFromQuestion < ActiveRecord::Migration[5.0]
  def change
    remove_column :questions, :harmonized, :boolean
  end
end
