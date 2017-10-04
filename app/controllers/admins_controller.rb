class AdminsController < ApplicationController
  authorize_resource class: false

  def index
    render json: User.where(admin: true)
  end
end
