class CreateResponseTypes < ActiveRecord::Migration[5.0]
  def change
    create_table :response_types do |t|
      t.string :name
      t.timestamps
    end
    # run bundle exec rake db:seed to add response types
  end
end
