class AddOmbApprovalDateToSurveys < ActiveRecord::Migration[5.1]
  def change
    add_column :surveys, :omb_approval_date, :date
  end
end
