module Api
  class SystemsController < Api::ApplicationController
    respond_to :json

    def index
      @systems = params[:search] ? SurveillanceSystem.search(params[:search]) : SurveillanceSystem.all
      @systems = params[:limit] ? @systems.limit(params[:limit].to_i) : @systems.limit(100)
      render json: @systems, each_serializer: SystemSerializer
    end

    def show
      @system = SurveillanceSystem.find_by(id: params[:id])
      if @system.nil?
        not_found
        return
      end
      render json: @system, serializer: SystemSerializer
    end

    def usage
      @system = SurveillanceSystem.find_by(id: params[:id])
      if @system.nil?
        not_found
        return
      end
      render json: @system, serializer: UsageSerializer
    end
  end
end
