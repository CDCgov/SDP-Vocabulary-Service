class AddResponseSetToQuestion < ActiveRecord::Migration[5.0]
  def change
    add_reference :questions, :response_set, foreign_key: true
  end
end
