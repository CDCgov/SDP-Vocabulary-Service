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
      section.section_nested_items.each do |sni|
        UpdateIndexJob.perform_later('question', sni.question.id) if sni.question
        UpdateIndexJob.perform_later('section', sni.nested_section.id) if sni.nested_section
        unique_response_sets << sni.response_set if sni.response_set && !unique_response_sets.include?(sni.response_set)
      end
      unique_response_sets.each do |rs|
        UpdateIndexJob.perform_later('response_set', rs.id)
      end
    end
  end
end
