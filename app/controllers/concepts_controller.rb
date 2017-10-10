class ConceptsController < ApplicationController
  def index
    render json: Concept.all
  end
end
