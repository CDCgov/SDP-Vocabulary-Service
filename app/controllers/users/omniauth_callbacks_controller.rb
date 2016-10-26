module Users
  class OmniauthCallbacksController < Devise::OmniauthCallbacksController
    def failure
      set_flash_message :alert, :failure, kind: OmniAuth::Utils.camelize(failed_strategy.name), reason: failure_message
      redirect_to after_omniauth_failure_path_for(resource_name)
    end

    # GET|POST /users/auth/twitter/callback
    # def failure
    #   super
    # end

    # protected

    # The path used when OmniAuth fails
    def after_omniauth_failure_path_for(scope)
      super(scope)
    end

    def openid_connect
      omniauth = request.env['omniauth.auth']
      authentication = Authentication.where(provider: omniauth['provider'], uid: omniauth['uid']).first
      if authentication
        flash[:notice] = 'Signed in successfully.'
        sign_in_and_redirect(:user, authentication.user)
      elsif current_user
        add_authentication_to_user(omniauth)
      else
        create_user_and_sign_in(omniauth)
      end
    end

    private

    def add_authentication_to_user(omniauth)
      current_user.authentications.create!(provider: omniauth['provider'], uid: omniauth['uid'])
      # AuditLog.create(requester_info: current_user.email, event: 'user_auth2', description: 'successful sign in')
      flash[:notice] = 'Authentication successful.'
      redirect_to authentications_url
    end

    def create_user_and_sign_in(omniauth)
      user = User.new
      user.apply_omniauth(omniauth)
      if user.save
        user.authentications[0].save
        # AuditLog.create(requester_info: user.email, event: 'user_auth3', description: 'successful account create and sign in')
        flash[:notice] = 'Signed in successfully.'
        sign_in_and_redirect(:user, user)
      else
        session[:omniauth] = omniauth.except('extra')
        redirect_to new_user_registration_url
      end
    end
  end
end
