class SectionQuestion < ApplicationRecord
  belongs_to :section
  belongs_to :question
  belongs_to :response_set
  belongs_to :nested_section, class_name: 'Section'
  validates :position, presence: true
  validates_associated :section
  validate :must_have_nested_section_or_question, :not_nested_section_and_question

  after_commit :reindex, on: [:create, :destroy]
  after_commit :reindex_on_update, on: [:update]

  def must_have_nested_section_or_question
    if nested_section_id.blank? && question_id.blank?
      errors.add(:question, 'A question or section must be associated with this record')
    end
  end

  def not_nested_section_and_question
    if nested_section_id.present? && question_id.present?
      errors.add(:question, 'Cannot be associated with both a question and a nested section')
    end
  end

  # old_q is a SectionQuestion, new_q is hash representing a new section question from the request params
  def update_section_question(old_q, new_q)
    old_q.position = new_q[:position]
    old_q.program_var = new_q[:program_var]
    old_q.question_id = new_q[:question_id]
    old_q.nested_section_id = new_q[:nested_section_id]
    old_q.response_set_id = new_q[:response_set_id]
    # While this seems unecessary, checking changed? here improves
    old_q.save! if old_q.changed?
    old_q
  end

  def reindex
    UpdateIndexJob.perform_later('question', question.id) if previous_changes[:question_id]
    UpdateIndexJob.perform_later('response_set', response_set.id) if response_set
  end

  def reindex_on_update
    # While question can't actually change, previous_changes[:question_id] will exist if this section question was just created
    UpdateIndexJob.perform_later('question', question.id) if previous_changes[:question_id]
    if response_set && previous_changes[:response_set_id]
      UpdateIndexJob.perform_later('response_set', response_set.id)
    end
    previous_response_set = ResponseSet.find_by(id: previous_changes[:response_set_id][0]) if previous_changes[:response_set_id]
    UpdateIndexJob.perform_later('response_set', previous_response_set.id) if previous_response_set
  end
end