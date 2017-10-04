module Admin
  class RolesController < AdminController
    def index
      render json: User.where(admin: true)
    end
  end
end
