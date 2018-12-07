class ConceptServiceController < ApplicationController
  respond_to :json

  CONCEPT_SYSTEM_URL = Settings.concept_service_url + '/systems'
  CONCEPT_SEARCH_URL = Settings.concept_service_url + '/concepts'

  # GET /concepts/systems
  def systems
    @response = HTTParty.get(CONCEPT_SYSTEM_URL, open_timeout: 5)
    render json: @response.body, status: @response.code
  rescue Net::OpenTimeout
    render status: 504
  end

  # GET /concepts/search
  def search
    @response = HTTParty.get(CONCEPT_SEARCH_URL, { open_timeout: 5 }, query: { system: params[:system], version: params[:version], search: params[:search] })
    render json: @response.body, status: @response.code
  rescue Net::OpenTimeout
    render status: 504
  end
end
