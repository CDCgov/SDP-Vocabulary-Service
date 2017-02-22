# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require_relative 'config/application'
require 'rubocop/rake_task'

Rails.application.load_tasks
RuboCop::RakeTask.new

task default: [:create_reports_dir, :rubocop, 'brakeman:run', 'bundle_audit:run',
               'javascript:test', 'javascript:lint', 'erd:test']

task :create_reports_dir do
  FileUtils.mkdir('./reports') unless Dir.exist?('./reports')
end

namespace :assets do
  task precompile: 'webpack:compile' do
  end
end

namespace :javascript do
  task :test do
    sh('npm test')
  end

  task :lint do
    sh('npm run lint')
  end
end
