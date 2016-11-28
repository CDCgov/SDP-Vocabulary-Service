class AddResponseTypeToQuestion < ActiveRecord::Migration[5.0]
  def change
    add_reference :questions, :response_type, foreign_key: true
  end
end
