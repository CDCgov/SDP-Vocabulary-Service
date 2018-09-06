class AddResponseTypeToQuestion < ActiveRecord::Migration[5.0]
  def change
    add_reference :questions, :response_type, foreign_key: true
    rt = ResponseType.find_or_create_by(code: 'choice', name: 'Choice', description: 'Answer is a Coding drawn from a list of options.')
    Question.update_all response_type_id: rt.id if rt
  end
end
