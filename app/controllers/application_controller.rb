class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  include CanCan::ControllerAdditions

  rescue_from CanCan::AccessDenied do
    render status: 401, plain: 'AccessDenied'
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:first_name, :last_name, :email, :last_program_id])
    devise_parameter_sanitizer.permit(:account_update, keys: [:first_name, :last_name, :email, :last_program_id])
  end
end
