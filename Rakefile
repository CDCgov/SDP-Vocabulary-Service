# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require_relative 'config/application'

Rails.application.load_tasks

if Rails.env != 'production'
  require 'rubocop/rake_task'
  RuboCop::RakeTask.new
  task default: [:create_reports_dir, :rubocop, 'brakeman:run', 'bundle_audit:run',
                 'javascript:test', 'javascript:lint', 'erd:test', 'swagger:validate']
end

task :create_reports_dir do
  FileUtils.mkdir('./reports') unless Dir.exist?('./reports')
end

namespace :javascript do
  task :test do
    sh('yarn test')
  end

  task :lint do
    sh('yarn run lint')
  end
end

namespace :swagger do
  task :validate do
    sh('node node_modules/swagger-cli/bin/swagger.js validate public/api/vocab.yaml')
  end
end
