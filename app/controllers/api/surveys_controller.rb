module Api
  class SurveysController < Api::ApplicationController
    respond_to :json

    def index
      @surveys = params[:search] ? Survey.search(params[:search]) : Survey.all
      @surveys = params[:limit] ? @surveys.limit(params[:limit]) : @surveys
      @surveys = @surveys.order(version_independent_id: :asc)
      render json: @surveys, each_serializer: SurveySerializer
    end

    def show
      @survey = Survey.by_id_and_version(params[:id], params[:version])
      if @survey.nil?
        not_found
        return
      end
      render json: @survey, serializer: SurveySerializer
    end
  end
end
