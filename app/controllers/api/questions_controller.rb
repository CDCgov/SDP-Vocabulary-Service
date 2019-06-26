# rubocop:disable Questions/LineLength
# rubocop:disable Questions/AbcSize

module Api
  class QuestionsController < Api::ApplicationController
    include Api
    respond_to :json

    def index
      @@tracker.pageview(path: "/api/questions/#{params[:limit]}", hostname: Settings.default_url_helper_host, title: 'API Question Show - Search criteria: ' + params[:search].to_s)
      @questions = if params[:search]
                     Question.includes(:response_type, :published_by).search(params[:search])
                   else
                     Question.all.includes(:response_type, :published_by)
                   end
      current_user_id = current_user ? current_user.id : -1
      @questions = if params[:limit] && (params[:limit].to_i < 100 || request.env['HTTP_ACCEPT_ENCODING'] == 'gzip')
                     @questions.limit(params[:limit].to_i).where("(status='published' OR created_by_id= ?)", current_user_id)
                   else
                     @questions.limit(100).where("(status='published' OR created_by_id= ?)", current_user_id)
                   end
      @questions = @questions.order(version_independent_id: :asc)
      render json: @questions, each_serializer: QuestionsSerializer
    end

    def show
      @question = Question.by_id_and_version(params[:id].upcase, params[:version])
      if @question.nil?
        @@tracker.pageview(path: "/api/questions/#{params[:id]}/#{params[:version]}", hostname: Settings.default_url_helper_host, title: 'API Question Not Found')
        not_found
        return
      else
        @@tracker.pageview(path: "/api/questions/#{params[:id]}/#{params[:version]}", hostname: Settings.default_url_helper_host, title: 'API Question Show')
        render json: @question, serializer: QuestionsSerializer
      end
    end

    def usage
      @question = Question.by_id_and_version(params[:id].upcase, params[:version])
      if @question.nil?
        @@tracker.pageview(path: "/api/questionsUsage/#{params[:id]}/#{params[:version]}", hostname: Settings.default_url_helper_host, title: 'API Question Usage Not Found')
        not_found
        return
      else
        @@tracker.pageview(path: "/api/questionsUsage/#{params[:id]}/#{params[:version]}", hostname: Settings.default_url_helper_host, title: 'API Question Usage Show')
        render json: @question, serializer: QuestionsSerializer
      end
    end
  end
end
