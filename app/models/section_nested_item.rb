class SectionNestedItem < ApplicationRecord
  belongs_to :section
  belongs_to :question
  belongs_to :response_set
  belongs_to :nested_section, class_name: 'Section'
  validates :position, presence: true
  validates_associated :section
  validate :must_have_nested_section_or_question, :not_nested_section_and_question, :no_nested_self

  after_commit :reindex, on: [:create, :destroy]
  after_commit :reindex_on_update, on: [:update]

  def all_questions
    all_qs = []
    nested_section.section_nested_items.each do |sni|
      if sni.nested_section
        sni.all_questions.each do |q|
          all_qs << q
        end
      else
        all_qs << sni
      end
    end
    all_qs
  end

  def must_have_nested_section_or_question
    if nested_section.blank? && question.blank?
      errors.add(:question, 'A question or section must be associated with this record')
    end
  end

  def not_nested_section_and_question
    if nested_section_id.present? && question_id.present?
      errors.add(:question, 'Cannot be associated with both a question and a nested section')
    end
  end

  def no_nested_self
    if nested_section_id.present? && nested_section_id == section_id
      errors.add(:section, 'Section cannot contain itself as a nested section')
    end
  end

  # old_sni is a SectionNestedItem, new_sni is hash representing a new section nested item from the request params
  def update_section_nested_item(old_sni, new_sni)
    old_sni.position = new_sni[:position]
    old_sni.program_var = new_sni[:program_var]
    old_sni.question_id = new_sni[:question_id]
    old_sni.nested_section_id = new_sni[:nested_section_id]
    old_sni.response_set_id = new_sni[:response_set_id]
    # While this seems unecessary, checking changed? here improves
    old_sni.save! if old_sni.changed?
    old_sni
  end

  def reindex
    UpdateIndexJob.perform_later('question', question.id) if question && previous_changes[:question_id]
    UpdateIndexJob.perform_later('response_set', response_set.id) if response_set
    UpdateIndexJob.perform_later('section', nested_section.id) if nested_section && previous_changes[:nested_section_id]
  end

  def reindex_on_update
    # While question can't actually change, previous_changes[:question_id] will exist if this section question was just created
    UpdateIndexJob.perform_later('question', question.id) if question && previous_changes[:question_id]
    UpdateIndexJob.perform_later('section', nested_section.id) if nested_section && previous_changes[:nested_section_id]
    if response_set && previous_changes[:response_set_id]
      UpdateIndexJob.perform_later('response_set', response_set.id)
    end
    previous_response_set = ResponseSet.find_by(id: previous_changes[:response_set_id][0]) if previous_changes[:response_set_id]
    UpdateIndexJob.perform_later('response_set', previous_response_set.id) if previous_response_set
  end
end
