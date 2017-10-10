class PublishersController < ApplicationController
  authorize_resource :user, parent: false

  def index
    render json: User.with_role(:publisher).preload(:roles)
  end
end
