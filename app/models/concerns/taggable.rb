module Taggable
  extend ActiveSupport::Concern

  included do
    has_many :concepts, as: :taggable, dependent: :destroy
  end
end
