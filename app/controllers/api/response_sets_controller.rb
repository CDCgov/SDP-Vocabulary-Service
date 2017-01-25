module Api
  class ResponseSetsController < ApplicationController
    respond_to :json

    def index
      @value_sets = params[:search] ? ResponseSet.search(params[:search]).latest_versions : ResponseSet.latest_versions
      @value_sets = params[:limit] ? @value_sets.limit(params[:limit]) : @value_sets
      @value_sets = @value_sets.order(version_independent_id: :asc)
      render json: @value_sets, each_serializer: ValueSetsSerializer
    end

    def show
      @value_set = ResponseSet.by_id_and_version(params[:id], params[:version])
      render json: @value_set, serializer: ValueSetsSerializer
    end

    def usage
      @value_set = ResponseSet.by_id_and_version(params[:id], params[:version])
      render json: @value_set, serializer: UsageSerializer
    end
  end
end
