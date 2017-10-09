class RegistrationsController < Devise::RegistrationsController
  respond_to :json

  def create
    if DISABLE_USER_REGISTRATION
      render json: { error: 'User registration is disabled.' }, status: :unprocessable_entity
    else
      super
    end
  end

  def new
    if DISABLE_USER_REGISTRATION
      render json: { error: 'User registration is disabled.' }, status: :unprocessable_entity
    else
      super
    end
  end

  private

  def update_resource(resource, params)
    resource.update_without_password(params)
  end

  def sign_up_params
    params.require(:user).permit(:first_name, :last_name, :email, :password,
                                 :password_confirmation, :last_program_id, :last_system_id)
  end

  def account_update_params
    params.require(:user).permit(:first_name, :last_name, :email, :password,
                                 :password_confirmation, :current_password, :last_program_id, :last_system_id)
  end
end
