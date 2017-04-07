module Api
  class ProgramsController < Api::ApplicationController
    respond_to :json

    def index
      @programs = params[:search] ? SurveillanceProgram.search(params[:search]) : SurveillanceProgram.all
      @programs = params[:limit] ? @programs.limit(params[:limit]) : @programs
      render json: @programs, each_serializer: ProgramSerializer
    end

    def show
      @program = SurveillanceProgram.find(params[:id], params[:version])
      if @program.nil?
        not_found
        return
      end
      render json: @program, serializer: ProgramSerializer
    end

    def usage
      @program = SurveillanceProgram.find(params[:id], params[:version])
      if @program.nil?
        not_found
        return
      end
      render json: @program, serializer: UsageSerializer
    end
  end
end
