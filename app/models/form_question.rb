class FormQuestion < ApplicationRecord
  belongs_to :form
  belongs_to :question
  belongs_to :response_set
  validates :position, presence: true

  after_commit :reindex, on: [:create, :update, :destroy]

  def reindex
    # While question can't actually change, previous_changes[:question_id] will exist if this form question was just created
    UpdateIndexJob.perform_later('question', ESQuestionSerializer.new(question).as_json) if previous_changes[:question_id]
    if response_set && previous_changes[:response_set_id]
      UpdateIndexJob.perform_later('response_set', ESResponseSetSerializer.new(response_set).as_json)
    end
    previous_response_set = ResponseSet.find_by(id: previous_changes[:response_set_id][0]) if previous_changes[:response_set_id]
    UpdateIndexJob.perform_later('response_set', ESResponseSetSerializer.new(previous_response_set).as_json) if previous_response_set
  end
end
