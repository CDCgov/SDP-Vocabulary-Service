require 'sdp/importers/cdc'
require 'sdp/importers/jupiter'
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

  desc 'Import Programs and Systems from Jupiter'
  task :import_jupiter, [:url] => :environment do |_t, args|
    base_url = args.url || 'http://jupiter.phiresearchlab.org/api/node/search/label/'
    systems = SDP::Importers::Jupiter.request(base_url + 'SurveillanceSystem')
    programs = SDP::Importers::Jupiter.request(base_url + 'Program')
    systems.each do |ss|
      SurveillanceSystem.find_or_create_by!(ss) unless SurveillanceSystem.find_by(name: ss[:name])
    end
    programs.each do |sp|
      SurveillanceProgram.find_or_create_by!(sp) unless SurveillanceProgram.find_by(name: sp[:name])
    end
  end
end
