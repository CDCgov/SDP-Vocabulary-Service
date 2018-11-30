module Api
  class SurveysController < Api::ApplicationController
    respond_to :json

    def index
      @surveys = if params[:search]
                   Survey.includes(:published_by, survey_sections:
                                    [section: { section_nested_items: [:response_set, :question, :nested_section] }]).search(params[:search])
                 else
                   Survey.includes(:published_by, survey_sections: [section: { section_nested_items: [:response_set, :question, :nested_section] }]).all
                 end
      current_user_id = current_user ? current_user.id : -1
      @surveys = if params[:limit] && (params[:limit].to_i < 100 || request.env['HTTP_ACCEPT_ENCODING'] == 'gzip')
                   @surveys.limit(params[:limit].to_i).where("(status='published' OR created_by_id= ?)", current_user_id)
                 else
                   @surveys.limit(100).where("(status='published' OR created_by_id= ?)", current_user_id)
                 end
      @surveys = @surveys.order(version_independent_id: :asc)
      render json: @surveys, each_serializer: SurveySerializer
    end

    def show
      @survey = Survey.by_id_and_version(params[:id].upcase, params[:version])
      if @survey.nil?
        not_found
        return
      end
      render json: @survey, serializer: SurveySerializer
    end
  end
end
