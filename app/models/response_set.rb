class ResponseSet < ApplicationRecord
  has_many :questions
  has_many :responses
end
