class AddStatusToSurvey < ActiveRecord::Migration[5.0]
  def change
    add_column :surveys, :status, :sting, default: 'draft'
  end
end
