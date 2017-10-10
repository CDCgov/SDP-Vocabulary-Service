class AdministratorsController < ApplicationController
  authorize_resource :user, parent: false

  def index
    render json: User.with_role(:admin).preload(:roles)
  end
end
