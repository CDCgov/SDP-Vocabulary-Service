class AddNotificationsTable < ActiveRecord::Migration[5.0]
  def change
    create_table :notifications do |t|
      t.references :user
      t.string :url
      t.string :message
      t.boolean :read, default: false
      t.timestamps
    end
  end
end
