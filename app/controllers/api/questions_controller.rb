module Api
  class QuestionsController < Api::ApplicationController
    include Api
    respond_to :json

    def index
      @questions = if params[:search]
                     Question.includes(:response_type, :published_by).search(params[:search])
                   else
                     Question.all.includes(:response_type, :published_by)
                   end
      current_user_id = current_user ? current_user.id : -1
      @questions = if params[:limit]
                     @questions.limit(params[:limit]).where("(status='published' OR created_by_id= ?)", current_user_id)
                   else
                     @questions.limit(100).where("(status='published' OR created_by_id= ?)", current_user_id)
                   end
      @questions = @questions.order(version_independent_id: :asc)
      render json: @questions, each_serializer: QuestionsSerializer
    end

    def show
      @question = Question.by_id_and_version(params[:id], params[:version])
      if @question.nil?
        not_found
        return
      end
      render json: @question, serializer: QuestionsSerializer
    end

    def usage
      @question = Question.by_id_and_version(params[:id, params[:version]])
      if @question.nil?
        not_found
        return
      end
      render json: @question, serializer: UsageSerializer
    end
  end
end
