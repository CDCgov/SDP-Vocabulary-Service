class ConceptsController < ApplicationController
  load_and_authorize_resource

  def index
    render json: Concept.all
  end
end
