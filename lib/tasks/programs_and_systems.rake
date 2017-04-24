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

  desc 'Import Programs and Systems from the Enterprise Data Excel File'
  task :import_excel, [:file] => :environment do |_t, args|
    SDP::Importers::CDC.import_enterprise_data_spreadsheet(args.file)
  end
end
