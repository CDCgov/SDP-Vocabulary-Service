module Mappable
  extend ActiveSupport::Concern

  included do
    has_many :concepts, as: :mappable, dependent: :destroy
    accepts_nested_attributes_for :concepts, allow_destroy: true
  end

  def update_concepts(type)
    @concepts = Concept.where(mappable_id: id, mappable_type: type)
    concepts.destroy_all
    concepts << @concepts
  end
end
