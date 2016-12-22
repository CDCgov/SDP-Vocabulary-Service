class Question < ApplicationRecord
  include Versionable
  acts_as_commentable

  has_many :question_response_sets
  has_many :response_sets, through: :question_response_sets
  has_many :form_questions
  has_many :forms, through: :form_questions

  belongs_to :response_type
  belongs_to :question_type
  belongs_to :created_by, class_name: 'User'
  belongs_to :updated_by, class_name: 'User'

  validates :content, presence: true
  # validates :question_type_id, presence: true

  def self.search(search)
    where('content ILIKE ?', "%#{search}%")
  end

  def build_new_revision
    new_revision = Question.new(content: content,
                                version_independent_id: version_independent_id,
                                version: version + 1, question_response_sets: question_response_sets,
                                response_sets: response_sets, form_questions: form_questions, forms: forms,
                                question_type: question_type,
                                response_type: response_type)
    new_revision
  end
end
