# rubocop:disable Programs/LineLength

module Api
  class ProgramsController < Api::ApplicationController
    respond_to :json

    def index
      @@tracker.pageview(path: "/api/programs/#{params[:limit]}", hostname: Settings.default_url_helper_host, title: 'API Programs Show - Search criteria: ' + params[:search].to_s)
      @programs = params[:search] ? SurveillanceProgram.search(params[:search]) : SurveillanceProgram.all
      @programs = params[:limit] ? @programs.limit(params[:limit].to_i) : @programs.limit(100)
      render json: @programs, each_serializer: ProgramSerializer
    end

    def show
      @program = SurveillanceProgram.find_by(id: params[:id])
      if @program.nil?
        @@tracker.pageview(path: "/api/programs/#{params[:id]}", hostname: Settings.default_url_helper_host, title: 'API Program Not Found')
        not_found
        return
      else
        @@tracker.pageview(path: "/api/programs/#{params[:id]}", hostname: Settings.default_url_helper_host, title: 'API Program Show')
        render json: @program, serializer: ProgramSerializer
      end
    end

    def usage
      @program = SurveillanceProgram.find_by(id: params[:id])
      if @program.nil?
        @@tracker.pageview(path: "/api/programsUsage/#{params[:id]}", hostname: Settings.default_url_helper_host, title: 'API Program Usage Not Found')
        not_found
        return
      else
        @@tracker.pageview(path: "/api/programsUsage/#{params[:id]}", hostname: Settings.default_url_helper_host, title: 'API Program Usage Show')
        render json: @program, serializer: ProgramSerializer
      end
    end
  end
end
