module Api
  class SurveysController < Api::ApplicationController
    respond_to :json

    def index
      @surveys = if params[:search]
                   Survey.includes(:published_by, survey_forms: [form: { form_questions: [:response_set, :question] }]).search(params[:search])
                 else
                   Survey.includes(:published_by, survey_forms: [form: { form_questions: [:response_set, :question] }]).all
                 end
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
