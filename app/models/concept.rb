class Concept < ApplicationRecord
  belongs_to :mappable, polymorphic: true
end
