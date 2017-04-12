class AuthenticationsController < ApplicationController
  def index
    if current_user
      user_copy = current_user.as_json.clone
      user_copy[:publisher] = current_user.has_role?(:publisher)
    end

    respond_to do |format|
      format.html { @authentications = current_user.authentications if current_user }
      format.json { render json: user_copy || {} }
    end
  end

  def destroy
    @authentication = current_user.authentications.find(params[:id])
    @authentication.destroy
    flash[:notice] = 'Successfully destroyed authentication.'
    redirect_to authentications_url
  end
end
