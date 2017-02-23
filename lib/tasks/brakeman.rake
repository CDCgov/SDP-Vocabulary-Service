begin
  namespace :brakeman do
    desc 'Run Brakeman'
    task :run do
      require 'brakeman'
      Brakeman.run app_path: '.', config_file: '.brakeman.yml'
    end
  end
rescue LoadError
  desc 'breakman rake task not available (brakeman not installed)'
  task :brakeman do
    abort 'Brakeman audit rake task is not available. Be sure to install brakeman as a gem or plugin'
  end
end
