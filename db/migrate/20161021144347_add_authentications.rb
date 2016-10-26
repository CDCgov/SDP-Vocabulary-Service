class AddAuthentications < ActiveRecord::Migration[5.0]
  def change
    create_table :authentications do |t|
      t.string :provider, null: false
      t.string :uid, null: false
      t.references :user, foreign_key: true
      t.timestamps
    end
  end
end
