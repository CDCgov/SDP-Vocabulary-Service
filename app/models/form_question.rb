class FormQuestion < ApplicationRecord
  belongs_to :form
  belongs_to :question
  belongs_to :response_set
  # validates_uniqueness_of :position, :scope => :form

  after_commit :reindex, on: [:create, :update, :delete, :destroy]

  def reindex
    UpdateIndexJob.perform_later('question', ESQuestionSerializer.new(question).as_json)
    UpdateIndexJob.perform_later('response_set', ESResponseSetSerializer.new(response_set).as_json) if response_set
  end
end
