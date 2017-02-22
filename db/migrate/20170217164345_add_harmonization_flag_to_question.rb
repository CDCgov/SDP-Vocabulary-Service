class AddHarmonizationFlagToQuestion < ActiveRecord::Migration[5.0]
  def change
    add_column :questions, :harmonized, :boolean
  end
end
