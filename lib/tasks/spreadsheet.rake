require 'sdp/importers/spreadsheet'
namespace :spreadsheet do
  desc 'Import MMG Spreadsheet'
  task :import, [:file, :user_email, :verbose] => :environment do |_t, args|
    user = User.find_by(email: args.user_email)
    if user.nil?
      STDERR.puts "Unable to find user #{args.user_email}"
      exit(-1)
    end 
    parser = SDP::Importers::Spreadsheet.new(args.file, user)
    errs = parser.parse!
    parser.errors.each do |err|
      STDERR.puts err
    end
    if args.verbose && (args.verbose=='y' || args.verbose=='Y')
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
