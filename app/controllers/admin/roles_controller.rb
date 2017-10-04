module Admin
  class RolesController < AdminController
    def grant_admin
      user = User.find_by(email: params[:email])
      if user
        user.add_role :admin
        user.save
        render json: User.with_role(:admin).preload(:roles), status: 200
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

    def grant_publisher
      user = User.find_by(email: params[:email])
      if user
        user.add_role :publisher
        user.save
        render json: User.with_role(:publisher).preload(:roles), status: 200
      else
        # Return user not found
        render json: User.with_role(:publisher).preload(:roles), status: :unprocessable_entity
      end
    end

    def revoke_publisher
      user = User.find_by(id: params[:pub_id])
      if user
        user.remove_role :publisher
        user.save
        render json: User.with_role(:publisher).preload(:roles), status: 200
      else
        # Return user not found
        render json: User.with_role(:publisher).preload(:roles), status: :unprocessable_entity
      end
    end
  end
end
