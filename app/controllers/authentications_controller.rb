class AuthenticationsController < ApplicationController
  def index
    respond_to do |format|
      format.html { @authentications = current_user.authentications if current_user }
      format.json { render json: current_user || {} }
    end
  end

  def destroy
    @authentication = current_user.authentications.find(params[:id])
    @authentication.destroy
    flash[:notice] = 'Successfully destroyed authentication.'
    redirect_to authentications_url
  end
end
