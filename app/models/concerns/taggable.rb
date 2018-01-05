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

  def add_tags(params)
    tag_params = params.permit(:concepts_attributes, concepts_attributes: [:value, :display_name, :code_system])
    concepts.destroy_all
    tag_params[:concepts_attributes].each do |c|
      concept = Concept.new(c)
      concept.save!
      concepts << concept
    end
  end
end
