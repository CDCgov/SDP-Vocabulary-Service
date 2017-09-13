class Concept < ApplicationRecord
  belongs_to :taggable, polymorphic: true
end
