require 'sdp/importers/spreadsheet'
namespace :spreadsheet do
  desc 'Import MMG Spreadsheet'
  task :import, [:file, :user_email, :verbose, :tab_name] => :environment do |_t, args|
    user = User.find_by(email: args.user_email)
    if user.nil?
      STDERR.puts "Unable to find user #{args.user_email}"
      exit(-1)
    end
    config = {}
    config[:de_tab_name] = args.tab_name unless args.tab_name.nil?
    parser = SDP::Importers::Spreadsheet.new(args.file, user, config)
    parser.parse!
    parser.errors.each do |err|
      STDERR.puts err
    end
    if args.verbose && (args.verbose == 'y' || args.verbose == 'Y')
      parser.sections do |name, data_elements|
        puts "#{name}: #{data_elements.length}"
        data_elements.each do |data_element|
          puts "  #{data_element[:name]}"
        end
      end
    end
    parser.save!
  end
end
