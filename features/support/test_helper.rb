require 'capybara/webkit'

Capybara:Webkit.configure do |config|
  config.allow_url('fonts.googleapis.com')
end
