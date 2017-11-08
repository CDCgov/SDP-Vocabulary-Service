class QuestionType < ApplicationRecord
  validates :name, presence: true
  has_many :questions, dependent: :nullify
end

class CreateQuestionTypes < ActiveRecord::Migration[5.0]
  def change
    create_table :question_types do |t|
      t.string :name
      t.timestamps
    end
  end
end
