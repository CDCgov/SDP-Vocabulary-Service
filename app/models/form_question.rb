class FormQuestion < ApplicationRecord
  belongs_to :form
  belongs_to :question
  belongs_to :response_set
end
