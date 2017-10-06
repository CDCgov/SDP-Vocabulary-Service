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
        render json: { msg: "No user found with email #{params[:email]}, make sure email is in correct format" }, status: :unprocessable_entity
      end
    end

    def revoke_admin
      user = User.find_by(id: params[:admin_id])
      if user && user.id == current_user.id
        render json: { msg: 'Cannot revoke admin on your own user' }, status: :unprocessable_entity
      elsif user
        user.remove_role :admin
        user.save
        render json: User.with_role(:admin).preload(:roles), status: 200
      else
        # Return user not found
        render json: { msg: 'Error when removing user, please refresh application and try again' }, status: :unprocessable_entity
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
        render json: { msg: "No user found with email #{params[:email]}, make sure email is in correct format" }, status: :unprocessable_entity
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
        render json: { msg: 'Error when removing user, please refresh application and try again' }, status: :unprocessable_entity
      end
    end
  end
end
