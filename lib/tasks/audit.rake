begin
  require 'bundler/audit/cli'

  namespace :bundle_audit do
    desc 'Update bundle-audit database'
    task :update do
      Bundler::Audit::CLI.new.update
    end
    desc 'Check gems for vulns using bundle-audit'
    task :check do
      Bundler::Audit::CLI.new.check
    end

    desc 'Update vulns database and check gems using bundle-audit'
    task :run do
      Rake::Task['bundle_audit:update'].invoke
      Rake::Task['bundle_audit:check'].invoke
    end
  end

  task :bundle_audit do
    Rake::Task['bundle_audit:run'].invoke
  end
rescue LoadError
  desc 'bundle audit rake task not available (bundle audit not installed)'
  task :bundle_audit do
    abort 'Bundle audit rake task is not available. Be sure to install bundle audit as a gem or plugin'
  end
end
