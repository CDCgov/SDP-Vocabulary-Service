class RemoveResponseSetFromQuestion < ActiveRecord::Migration[5.0]
  def change
    remove_reference :questions, :response_set, foreign_key: true
  end
end
