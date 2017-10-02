class QuestionTypesController < ApplicationController
  load_and_authorize_resource

  def index
    render json: QuestionType.all
  end
end
