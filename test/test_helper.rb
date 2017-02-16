ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'

require_relative 'support/rails.rb'
Dir[File.expand_path('../support/*.rb', __FILE__)].each { |rb| require(rb) }
