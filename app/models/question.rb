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
  belongs_to :parent, class_name: 'Question'

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

  def self.search(search = nil, current_user_id = nil)
    if current_user_id && search
      where("(status='published' OR created_by_id= ?) AND (content ILIKE ?)", current_user_id, "%#{search}%")
    elsif current_user_id
      where("(status= 'published' OR created_by_id = ?)", current_user_id)
    elsif search
      where('status= ? and content ILIKE ?', 'published', "%#{search}%")
    else
      where('status=  ?', 'published')
    end
  end

  def publish
    update(status: 'published') if status == 'draft'
  end

  def build_new_revision
    new_revision = Question.new(content: content, description: description, status: status,
                                version_independent_id: version_independent_id,
                                version: version + 1, question_response_sets: question_response_sets,
                                response_sets: response_sets, form_questions: form_questions, forms: forms,
                                question_type: question_type, oid: oid, parent_id: parent_id,
                                response_type: response_type)
    concepts.each do |c|
      new_revision.concepts << c.dup
    end

    new_revision
  end
end
