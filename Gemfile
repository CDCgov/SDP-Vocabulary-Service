source 'https://rubygems.org'

gem 'rack'
# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 5.0.0', '>= 5.0.0.1'
# Use sqlite3 as the database for Active Record
gem 'pg'
# Use Puma as the app server
gem 'puma', '~> 3.0'

gem 'webpack-rails'
gem 'olive_branch'

gem 'active_model_serializers', '~> 0.10.0'
gem 'json_schema'

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.5'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 3.0'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development
gem 'devise', '~>4.2.0'
gem 'cancancan'
gem 'rolify'
gem 'omniauth'
gem 'js-routes'
gem 'acts_as_tree'
gem 'acts_as_commentable'
gem 'omniauth_openid_connect'
gem 'elasticsearch'
gem 'config'

group :development, :test do
  gem 'fakeweb', '~> 1.3'
  gem 'rubocop', '~> 0.44.1', require: false
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug'
  gem 'cucumber-rails', require: false
  gem 'database_cleaner', git: 'https://github.com/DatabaseCleaner/database_cleaner.git'
  gem 'scss_lint', require: false
  gem 'capybara'
  gem 'capybara-accessible'
  gem 'capybara-webkit'
  gem 'headless'
  gem 'axe-matchers'
  gem 'selenium-webdriver', '2.48.0'
  gem 'parallel_tests'
  gem 'overcommit'
  gem 'pry'
  gem 'pry-nav'
  gem 'pry-rescue'
  gem 'pry-stack_explorer'
end

group :development do
  # Generate ERD documentation for database structure
  gem 'rails-erd'
  # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
  gem 'web-console'
  gem 'listen', '~> 3.0.5'

  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
end

group :test do
  gem 'mocha', require: false
  gem 'minitest'
  gem 'minitest-rails'
  gem 'minitest-reporters'
  gem 'simplecov', require: false
  gem 'brakeman', require: false
  gem 'bundler-audit'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]

gem 'foreman'
