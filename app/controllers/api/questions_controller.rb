module Api
	class QuestionsController < ApplicationController
	respond_to :json

		def index
			@questions = params[:search] ? Question.search(params[:search]).latest_versions : Question.latest_versions
			respond_with params[:limit] ? @questions.limit(params[:limit]) : @questions
		end

		def show
			respond_with Question.find(params[:id])
		end
	end
end