module Api
	class QuestionsController < ApplicationController
	respond_to :json

		def index
			@questions = params[:search] ? Question.search(params[:search]).latest_versions : Question.latest_versions
			@questions = params[:limit] ? @questions.limit(params[:limit]) : @questions
			render json: @questions, each_serializer: QuestionsSerializer
		end

		def show
			@question = Question.find(params[:id])
			render json: @question, serializer: QuestionsSerializer
		end
	end
end