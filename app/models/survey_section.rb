class SurveySection < ApplicationRecord
  belongs_to :survey
  belongs_to :section
  validates :position, presence: true
  # Note, the only updates we currently allow are changing position, so we dont need to call reindex on update
  after_commit :reindex, on: [:create, :destroy]

  def reindex
    if section
      UpdateIndexJob.perform_later('section', section.id)
      unique_response_sets = []
      section.section_questions.each do |sq|
        UpdateIndexJob.perform_later('question', sq.question.id)
        unique_response_sets << sq.response_set if sq.response_set && !unique_response_sets.include?(sq.response_set)
      end
      unique_response_sets.each do |rs|
        UpdateIndexJob.perform_later('response_set', rs.id)
      end
    end
  end
end
