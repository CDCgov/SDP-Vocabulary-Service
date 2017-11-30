module ApplicationHelper
  include Devise::OmniAuth::UrlHelpers

  def environment_tags
    disable_ur = Settings.disable_user_registration
    disable_ur = false if Settings.display_login
    safe_join [(tag.meta name: 'DISABLE_LOGIN_UI', content: disable_ur),
               (tag.meta name: 'environment', content: Rails.env)]
  end
end
