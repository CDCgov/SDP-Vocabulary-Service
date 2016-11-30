class Question < ApplicationRecord
  has_many :question_response_sets
  has_many :response_sets, through: :question_response_sets
  has_many :form_questions
  has_many :forms, through: :form_questions
  belongs_to :response_type
  belongs_to :question_type
  belongs_to :created_by, class_name: 'User'
  belongs_to :updated_by, class_name: 'User'
  validates :content, presence: true
  validates :question_type_id, presence: true
  validates :version_independent_id, presence: true,
                                     if: proc { |q| q.version > 1 }
  validates :version, presence: true, uniqueness: { scope: :version_independent_id,
                                                    message: 'versions should be unique across a revised  ' }

  after_save :assign_version_independent_id,
             if: proc { |q| q.version == 1 && q.version_independent_id.blank? }

  def self.search(search)
    where('content ILIKE ?', "%#{search}%")
  end

  def self.latest_versions
    joins('INNER JOIN (SELECT version_independent_id, MAX(version) as version
             FROM questions GROUP BY version_independent_id) q
             ON q.version_independent_id = questions.version_independent_id
             AND questions.version = q.version')
  end

  def assign_version_independent_id
    if version == 1
      update_attribute(:version_independent_id, "Q-#{id}")
    else
      # If you have a ResponseSet with a version greater than 1, it should
      # already have a version_independent_id set.
      raise ActiveRecord::RecordInvalid, self
    end
  end

  def build_new_revision
    new_revision = Question.new(content: content,
                                version_independent_id: version_independent_id,
                                version: version + 1, question_response_sets: question_response_sets,
                                response_sets: response_sets, form_questions: form_questions, forms: forms,
                                question_type: question_type)
    new_revision
  end

  def other_versions
    Question.where(version_independent_id: version_independent_id)
            .where.not(version: version)
            .order(version: :desc)
  end

  def all_versions
    Question.where(version_independent_id: version_independent_id)
            .order(version: :desc)
  end

  def most_recent
    if other_versions[0].version > version
      other_versions[0].version
    else
      version
    end
  end

  def most_recent?
    if other_versions[0].version > version
      false
    else
      true
    end
  end
end
