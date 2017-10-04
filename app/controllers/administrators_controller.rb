class AdministratorsController < ApplicationController
  authorize_resource class: false

  def index
    render json: User.with_role(:admin).preload(:roles)
  end
end
