# It is expected that all ResponseTypes will be instances of
# https://www.hl7.org/fhir/DSTU2/valueset-answer-format.html
class ResponseType < ApplicationRecord
  validates :name, presence: true, uniqueness: true
end
