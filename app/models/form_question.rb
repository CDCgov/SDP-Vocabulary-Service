class FormQuestion < ApplicationRecord
  belongs_to :form
  belongs_to :question
  belongs_to :response_set

  after_destroy do |fq|
    UpdateIndexJob.perform_later('question', ESQuestionSerializer.new(fq.question).as_json)
    UpdateIndexJob.perform_later('response_set', ESQuestionSerializer.new(fq.response_set).as_json) if fq.response_set
  end

  after_save do |fq|
    UpdateIndexJob.perform_later('question', ESQuestionSerializer.new(fq.question))
    UpdateIndexJob.perform_later('response_set', ESQuestionSerializer.new(fq.response_set).as_json) if fq.response_set
  end
end
