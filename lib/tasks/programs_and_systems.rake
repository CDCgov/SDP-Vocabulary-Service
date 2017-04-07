require 'sdp/importers/cdc'
namespace :cdc do
  desc 'Import Surveillance Programs from a CSV File'
  task :import_programs, [:file] => :environment do |_t, args|
    SDP::Importers::CDC.import_programs(args.file)
  end

  desc 'Import Surveillance Systems from a CSV File'
  task :import_systems, [:file] => :environment do |_t, args|
    SDP::Importers::CDC.import_systems(args.file)
  end
end
