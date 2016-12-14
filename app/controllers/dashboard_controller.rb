class DashboardController < ApplicationController
  def index
    @questions = Question.latest_versions
    @response_sets = ResponseSet.latest_versions
  end
end
