class QuestionTypesController < ApplicationController
  def index
    render json: QuestionType.all
  end
end
