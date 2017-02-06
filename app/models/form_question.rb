class FormQuestion < ApplicationRecord
  belongs_to :form
  belongs_to :question
  belongs_to :response_set

  after_delete do |fq|
    UpdateIndexJob.perform_async('question', ESQuestionSerializer.new(fq.question))
    UpdateIndexJob.perform_async('response_set', ESQuestionSerializer.new(fq.response_set)) if fq.response_set
  end

  after_save do |fq|
    UpdateIndexJob.perform_async('question', ESQuestionSerializer.new(fq.question))
    UpdateIndexJob.perform_async('response_set', ESQuestionSerializer.new(fq.response_set)) if fq.response_set
  end
end
