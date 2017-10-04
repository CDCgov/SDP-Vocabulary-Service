class AdminController < ApplicationController
  before_action :require_admin
  load_and_authorize_resource

  def require_admin
    admin_flag = current_user && current_user.has_role?(:admin)
    redirect_to root_path unless admin_flag
  end
end
