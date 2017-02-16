ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'

require_relative 'support/rails.rb'
Dir[File.expand_path('../support/*.rb', __FILE__)].each { |rb| require(rb) }

Capybara::Webkit.configure do |config|
  # allow fonts to be loaded from google
  config.allow_url('fonts.googleapis.com')
end
