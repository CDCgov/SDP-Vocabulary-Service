class SurveyForm < ApplicationRecord
  belongs_to :survey
  belongs_to :form
  validates :position, presence: true
  # Note, the only updates we currently allow are changing position, so we dont need to call reindex on update
  after_commit :reindex, on: [:create, :destroy]

  def reindex
    if form
      UpdateIndexJob.perform_later('form', ESFormSerializer.new(form).as_json)
      unique_response_sets = []
      form.form_questions.each do |fq|
        UpdateIndexJob.perform_later('question', ESQuestionSerializer.new(fq.question).as_json)
        unique_response_sets << fq.response_set if fq.response_set && !unique_response_sets.include?(fq.response_set)
      end
      unique_response_sets.each do |rs|
        UpdateIndexJob.perform_later('response_set', ESResponseSetSerializer.new(rs).as_json)
      end
    end
  end
end
