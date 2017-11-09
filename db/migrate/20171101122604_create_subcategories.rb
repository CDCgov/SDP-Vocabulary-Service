class QuestionType < ApplicationRecord
  validates :name, presence: true
  has_many :questions, dependent: :nullify
end

class CreateSubcategories < ActiveRecord::Migration[5.1]
  def change
    create_table :subcategories do |t|
      t.string :name
      t.references :question_type, foreign_key: true
    end
    add_reference :questions, :subcategory, foreign_key: true

    unless Subcategory.find_by(name: 'Sexual Behavior')
      ep = QuestionType.find_or_create_by name: 'Emergency Preparedness'
      epid = QuestionType.find_or_create_by name: 'Epidemiological'

      Subcategory.find_or_create_by name: 'Managing & Commanding', question_type_id: ep.id
      Subcategory.find_or_create_by name: 'Operations', question_type_id: ep.id
      Subcategory.find_or_create_by name: 'Planning/Intelligence', question_type_id: ep.id
      Subcategory.find_or_create_by name: 'Logistics', question_type_id: ep.id
      Subcategory.find_or_create_by name: 'Financial/Administration', question_type_id: ep.id

      Subcategory.find_or_create_by name: 'Travel', question_type_id: epid.id
      Subcategory.find_or_create_by name: 'Contact or Exposure', question_type_id: epid.id
      Subcategory.find_or_create_by name: 'Drug Abuse', question_type_id: epid.id
      Subcategory.find_or_create_by name: 'Sexual Behavior', question_type_id: epid.id
    end
  end
end
