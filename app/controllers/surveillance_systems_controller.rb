class SurveillanceSystemsController < ApplicationController
  authorize_resource only: [:create]

  def index
    render json: SurveillanceSystem.all
  end

  def create
    @surveillance_system = SurveillanceSystem.new(surveillance_system_params)
    if SurveillanceSystem.find_by(name: @surveillance_system.name)
      render json: { msg: "A surveillance system named #{@surveillance_system.name} already exists" }, status: :unprocessable_entity
    elsif @surveillance_system.save
      render json: SurveillanceSystem.all
    else
      render json: { msg: 'Error saving system - check format, name cannot be blank' }, status: :unprocessable_entity
    end
  end

  private

  def surveillance_system_params
    params.permit(:name, :description, :acronym)
  end
end
