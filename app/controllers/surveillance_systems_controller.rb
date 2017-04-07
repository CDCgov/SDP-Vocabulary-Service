class SurveillanceSystemsController < ApplicationController
  def index
    render json: SurveillanceSystem.all
  end
end
