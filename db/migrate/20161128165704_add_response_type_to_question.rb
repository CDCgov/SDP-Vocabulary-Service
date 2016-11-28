class AddResponseTypeToQuestion < ActiveRecord::Migration[5.0]
  def change
    add_reference :questions, :response_type, foreign_key: true
    Question.update_all response_type_id: ResponseType.find_by(name: 'Response Set')
  end
end
