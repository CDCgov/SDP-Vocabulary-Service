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
      @questions = params[:limit] ? @questions.limit(params[:limit]) : @questions
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
