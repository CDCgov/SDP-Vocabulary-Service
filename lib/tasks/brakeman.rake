namespace :brakeman do
  desc 'Run Brakeman'
  task :run do
    require 'brakeman'
    Brakeman.run app_path: '.', config_file: '.brakeman.yml'
  end
end
