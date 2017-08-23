class FormQuestion < ApplicationRecord
  belongs_to :form
  belongs_to :question
  belongs_to :response_set
  validates :position, presence: true

  after_commit :reindex, on: [:create, :destroy]
  after_commit :reindex_on_update, on: [:update]

  def reindex
    UpdateIndexJob.perform_later('question', question.id) if previous_changes[:question_id]
    UpdateIndexJob.perform_later('response_set', response_set.id) if response_set
  end

  def reindex_on_update
    # While question can't actually change, previous_changes[:question_id] will exist if this form question was just created
    UpdateIndexJob.perform_later('question', question.id) if previous_changes[:question_id]
    if response_set && previous_changes[:response_set_id]
      UpdateIndexJob.perform_later('response_set', response_set.id)
    end
    previous_response_set = ResponseSet.find_by(id: previous_changes[:response_set_id][0]) if previous_changes[:response_set_id]
    UpdateIndexJob.perform_later('response_set', previous_response_set.id) if previous_response_set
  end
end
