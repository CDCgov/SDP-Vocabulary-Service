class ConceptServiceController < ApplicationController
  respond_to :json

  CONCEPT_SYSTEM_URL = Settings.concept_service_url + '/systems'
  CONCEPT_SEARCH_URL = Settings.concept_service_url + '/concepts'

  # GET /concepts/systems
  def systems
    @response = HTTParty.get(CONCEPT_SYSTEM_URL)
    render json: @response.body, status: @response.code
  end

  # GET /concepts/search
  def search
    @response = HTTParty.get(CONCEPT_SEARCH_URL, query: { system: params[:system], version: params[:version], search: params[:search] })
    render json: @response.body, status: @response.code
  end
end
