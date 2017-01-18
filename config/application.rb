require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Vocabulary
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
    config.assets.enabled = false
    config.middleware.use 'OliveBranch::Middleware'
    Rails.application.routes.default_url_options[:host] = Settings.default_url_helper_host || 'localhost:3000'
  end
end
