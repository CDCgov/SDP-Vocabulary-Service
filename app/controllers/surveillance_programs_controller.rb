class SurveillanceProgramsController < ApplicationController
  def index
    render json: SurveillanceProgram.all
  end
end
