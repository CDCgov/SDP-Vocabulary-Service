class CreateResponseTypes < ActiveRecord::Migration[5.0]
  def change
    create_table :response_types do |t|
      t.string :name
      t.timestamps
    end
    ResponseType.create name: 'Response Set'
    ResponseType.create name: 'Free Text'
    ResponseType.create name: 'Date'
    ResponseType.create name: 'Integer'
    ResponseType.create name: 'Decimal'
  end
end
