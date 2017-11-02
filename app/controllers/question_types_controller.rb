class QuestionTypesController < ApplicationController
  def index
    @question_types = QuestionType.all
  end
end
