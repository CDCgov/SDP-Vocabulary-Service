class SurveyForm < ApplicationRecord
  belongs_to :survey
  belongs_to :form

  after_commit :reindex, on: [:create, :update, :destroy]

  def reindex
    UpdateIndexJob.perform_later('form', ESFormSerializer.new(form).as_json) if form
  end
end