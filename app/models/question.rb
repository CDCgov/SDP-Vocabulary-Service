class Question < ApplicationRecord
  include Versionable, OidGenerator
  acts_as_commentable

  has_many :question_response_sets
  has_many :response_sets, through: :question_response_sets
  has_many :form_questions
  has_many :forms, through: :form_questions
  has_many :concepts, dependent: :nullify

  belongs_to :response_type
  belongs_to :question_type
  belongs_to :created_by, class_name: 'User'
  belongs_to :updated_by, class_name: 'User'

  validates :content, presence: true
  accepts_nested_attributes_for :concepts, allow_destroy: true

  after_commit :index, on: [:create, :update]
  after_commit :delete_index, on: :destroy

  def index
    UpdateIndexJob.perform_later('question', ESQuestionSerializer.new(self).as_json)
  end

  def delete_index
    DeleteFromIndexJob.perform_later('question', id)
  end

  def self.search(search)
    where('content ILIKE ?', "%#{search}%")
  end

  def publish
    update(status: 'published') if status == 'draft'
  end

  def build_new_revision
    new_revision = Question.new(content: content, description: description, status: status,
                                version_independent_id: version_independent_id,
                                version: version + 1, question_response_sets: question_response_sets,
                                response_sets: response_sets, form_questions: form_questions, forms: forms,
                                question_type: question_type, oid: oid,
                                response_type: response_type)
    concepts.each do |c|
      new_revision.concepts << c.dup
    end

    new_revision
  end
end
