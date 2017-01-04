class MystuffController < ApplicationController
  def index
    @questions = Question.where(created_by: current_user)
    @response_sets = ResponseSet.where(created_by: current_user)
    @forms = Form.where(created_by: current_user)
  end
end
