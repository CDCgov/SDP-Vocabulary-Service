module Admin
  class RolesController < AdminController
    def index
      render json: User.with_role(:admin).preload(:roles)
    end

    def grant_admin
      user = User.find_by(email: params[:email])
      if user
        user.add_role :admin
        user.save
      else
        # Return user not found
        render json: User.with_role(:admin).preload(:roles), status: :unprocessable_entity
      end
    end

    def revoke_admin
      user = User.find_by(id: params[:admin_id])
      if user
        user.remove_role :admin
        user.save
        render json: User.with_role(:admin).preload(:roles), status: 200
      else
        # Return user not found
        render json: User.with_role(:admin).preload(:roles), status: :unprocessable_entity
      end
    end
  end
end
