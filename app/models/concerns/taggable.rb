module Taggable
  extend ActiveSupport::Concern

  included do
    has_many :concepts, as: :taggable, dependent: :destroy
    accepts_nested_attributes_for :concepts, allow_destroy: true
  end

  def update_concepts(type)
    @concepts = Concept.where(taggable_id: id, taggable_type: type)
    concepts.destroy_all
    concepts << @concepts
  end
end
