module Api
  class QuestionsController < ApplicationController
    respond_to :json

    def index
      @questions = params[:search] ? Question.search(params[:search]).latest_versions : Question.latest_versions
      @questions = params[:limit] ? @questions.limit(params[:limit]) : @questions
      render json: @questions, each_serializer: QuestionsSerializer
    end

    def show
      @question = Question.by_id_and_version(params[:id], params[:version])
      render json: @question, serializer: QuestionsSerializer
    end

    def usage
      @question = Question.by_id_and_version(params[:id, params[:version]])
      render json: @question, serializer: UsageSerializer
    end
  end
end
