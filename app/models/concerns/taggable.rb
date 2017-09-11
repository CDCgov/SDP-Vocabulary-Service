module Taggable
  extend ActiveSupport::Concern

  included do
    has_many :tags, as: :taggable
  end
end
