class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  include CanCan::ControllerAdditions

  rescue_from CanCan::AccessDenied do
    render status: 403, plain: 'AccessDenied'
  end
end
