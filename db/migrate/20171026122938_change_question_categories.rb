class QuestionType < ApplicationRecord
  validates :name, presence: true
  has_many :questions, dependent: :nullify
end

class ChangeQuestionCategories < ActiveRecord::Migration[5.1]
  def change
    unless QuestionType.find_by(name: 'Vaccine')
      QuestionType.find_or_create_by name: 'Demographics'
      QuestionType.find_or_create_by name: 'Clinical'
      QuestionType.find_or_create_by name: 'Treatment'
      QuestionType.find_or_create_by name: 'Laboratory'
      QuestionType.find_or_create_by name: 'Epidemiological'
      QuestionType.find_or_create_by name: 'Vaccine'
    end

    # Have to check individual because these weren't added to demo / prod
    # as part of the same seed file (some added manually I believe)
    old_qt = []
    old_qt[0] = { name: 'Clinical Data', replacement: 'Clinical' }
    old_qt[1] = { name: 'Laboratory Data', replacement: 'Laboratory' }
    old_qt[2] = { name: 'Patient Data', replacement: 'Demographics' }
    old_qt[3] = { name: 'Food Exposures', replacement: 'Epidemiological' }
    old_qt[4] = { name: 'Travel History', replacement: 'Epidemiological' }
    old_qt[5] = { name: 'Patient demographics', replacement: 'Demographics' }
    old_qt[6] = { name: 'Clinical signs and symptoms', replacement: 'Clinical' }
    old_qt[7] = { name: 'Past medical history/treatment', replacement: 'Treatment' }
    old_qt[8] = { name: 'Clinical outcome', replacement: 'Clinical' }
    old_qt[9] = { name: 'Laboratory information', replacement: 'Laboratory' }
    old_qt[10] = { name: 'Epidemiologic information', replacement: 'Epidemiological' }
    old_qt[11] = { name: 'Epidemiologic exposure history (places visited, persons, household contacts, etc.)', replacement: 'Epidemiological' }

    old_qt.each do |oqt|
      qt = QuestionType.find_by(name: oqt[:name])
      next unless qt
      qt.questions.each do |q|
        q.question_type = QuestionType.find_by(name: oqt[:replacement])
        q.save!
      end
      qt.delete
    end
  end
end
