module Api
  class SystemsController < Api::ApplicationController
    respond_to :json

    def index
      @@tracker.pageview(path: "/api/systems/#{params[:limit]}", hostname: Settings.default_url_helper_host, title: 'API System Show - Search criteria: ' + "#{params[:search]}")
      @systems = params[:search] ? SurveillanceSystem.search(params[:search]) : SurveillanceSystem.all
      @systems = params[:limit] ? @systems.limit(params[:limit].to_i) : @systems.limit(100)
      render json: @systems, each_serializer: SystemSerializer
    end

    def show
      @system = SurveillanceSystem.find_by(id: params[:id])
      if @system.nil?
        @@tracker.pageview(path: "/api/systems/#{params[:id]}", hostname: Settings.default_url_helper_host, title: 'API System Not Found')
        not_found('System')
        return
      else
        @@tracker.pageview(path: "/api/systems/#{params[:id]}", hostname: Settings.default_url_helper_host, title: 'API System Show')
        render json: @system, serializer: SystemSerializer
    end
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
