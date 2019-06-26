# rubocop:disable Surveys/LineLength
# rubocop:disable Surveys/AbcSize

module Api
  class SurveysController < Api::ApplicationController
    respond_to :json

    def index
      @@tracker.pageview(path: "/api/surveys/#{params[:limit]}", hostname: Settings.default_url_helper_host, title: 'API Survey Show - Search criteria: ' + params[:search].to_s)
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
        @@tracker.pageview(path: "/api/surveys/#{params[:id]}/#{params[:version]}", hostname: Settings.default_url_helper_host, title: 'API Survey Not Found')
        not_found
        return
      else
        @@tracker.pageview(path: "/api/surveys/#{params[:id]}/#{params[:version]}", hostname: Settings.default_url_helper_host, title: 'API Survey Show')
        render json: @survey, serializer: SurveySerializer
      end
    end
  end
end
