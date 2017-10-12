class SurveillanceProgramsController < ApplicationController
  authorize_resource only: [:create]

  def index
    render json: SurveillanceProgram.all
  end

  def create
    @surveillance_program = SurveillanceProgram.new(surveillance_program_params)
    if SurveillanceProgram.find_by(name: @surveillance_program.name)
      render json: { msg: "A surveillance program named #{@surveillance_program.name} already exists" }, status: :unprocessable_entity
    elsif @surveillance_program.save
      render json: SurveillanceProgram.all
    else
      render json: { msg: 'Error saving program - check format, name cannot be blank' }, status: :unprocessable_entity
    end
  end

  private

  def surveillance_program_params
    params.permit(:name, :description, :acronym)
  end
end
