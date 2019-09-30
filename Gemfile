source 'https://rubygems.org'

gem 'rack'
# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 5.1.2'
# Use sqlite3 as the database for Active Record
gem 'pg'
# Use Puma as the app server
gem 'puma', '~> 3.0'

gem 'olive_branch'
gem 'webpacker'

gem 'active_model_serializers', '~> 0.10.0'
gem 'json_schema'

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.5'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 3.0'
# Use ActiveModel has_secure_password
gem 'bcrypt', '~> 3.1.12'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development
gem 'acts-as-taggable-on', '~> 6.0'
gem 'acts_as_commentable'
gem 'acts_as_tree'
gem 'cancancan'
gem 'config'
gem 'devise', '~> 4.7', '>= 4.7.1'
gem 'elasticsearch'
gem 'httparty'
gem 'js-routes'
gem 'omniauth'
gem 'omniauth_openid_connect'
gem 'paper_trail'
gem 'rolify'
gem 'staccato'

# Gems to support MMG spreadsheet import
gem 'roo'
gem 'roo-xls'
gem 'savon'

# Gems to support writing spreadsheet export
gem 'axlsx', git: 'https://github.com/randym/axlsx.git', ref: 'c8ac844'
gem 'axlsx_rails'

group :development, :test do
  gem 'fakeweb', git: 'https://github.com/chrisk/fakeweb.git', branch: 'master'
  gem 'rubocop', '~> 0.49.0', require: false
  gem 'rubocop-checkstyle_formatter', require: false
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'axe-matchers'
  gem 'byebug'
  gem 'capybara'
  gem 'capybara-accessible'
  gem 'cucumber-rails', require: false
  gem 'database_cleaner', git: 'https://github.com/DatabaseCleaner/database_cleaner.git'
  gem 'json-schema'
  gem 'overcommit'
  gem 'parallel_tests'
  gem 'pry'
  gem 'pry-nav'
  gem 'pry-rescue'
  gem 'pry-stack_explorer'
  gem 'rubyzip', '~> 1.3'
  gem 'scss_lint', require: false
  gem 'selenium-webdriver'
end

group :development do
  # Generate ERD documentation for database structure
  gem 'rails-erd'
  # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
  gem 'listen', '~> 3.0.5'
  gem 'web-console'

  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
end

group :test do
  gem 'brakeman', require: false
  gem 'bundler-audit'
  gem 'minitest'
  gem 'minitest-rails'
  gem 'minitest-reporters'
  gem 'mocha', require: false
  gem 'simplecov', require: false
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby]

gem 'foreman'
