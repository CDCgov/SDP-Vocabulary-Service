class QuestionResponseSet < ApplicationRecord
  belongs_to :question
  belongs_to :response_set
end
