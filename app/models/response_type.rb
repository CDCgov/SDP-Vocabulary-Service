class ResponseType < ApplicationRecord
  validates :name, presence: true, uniqueness: true
end
