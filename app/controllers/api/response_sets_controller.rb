module Api
	class ResponseSetsController < ApplicationController
	respond_to :json

		def index
			@valueSets = params[:search] ? ResponseSet.search(params[:search]).latest_versions : ResponseSet.latest_versions
			@valueSets = params[:limit] ? @valueSets.limit(params[:limit]) : @valueSets
			render json: @valueSets, each_serializer: ValueSetsSerializer
		end
		
		def show
			@valueSet = ResponseSet.find(params[:id])
			render json: @valueSet, serializer: ValueSetsSerializer
		end
	end
end