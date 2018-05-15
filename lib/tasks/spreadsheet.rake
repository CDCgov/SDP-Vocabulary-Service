require 'sdp/importers/spreadsheet'

# rubocop:disable Metrics/BlockLength
namespace :spreadsheet do
  desc 'Import a Spreadsheet'
  task :import, [:file, :user_email, :is_mmg, :verbose, :survey_name] => :environment do |_t, args|
    user = User.find_by(email: args.user_email)
    if user.nil?
      STDERR.puts "Unable to find user #{args.user_email}"
      exit(-1)
    end
    config = { mmg: args.is_mmg == 'true' }
    config[:survey_name] = args.survey_name unless args.survey_name.nil? || args.survey_name.empty?
    import_type = 'mmg'
    parser = SDP::Importers::Spreadsheet.new(args.file, user, import_type, config)
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

  desc 'Append a Spreadsheet to an existing Survey'
  task :append, [:file, :user_email, :is_mmg, :verbose, :survey_id] => :environment do |_t, args|
    user = User.find_by(email: args.user_email)
    if user.nil?
      STDERR.puts "Unable to find user #{args.user_email}"
      exit(-1)
    end
    import_type = 'mmg'

    config[:de_tab_name] = args.tab_name unless args.tab_name.nil? || args.tab_name.empty?
    parser = SDP::Importers::Spreadsheet.new(args.file, user, import_type, config)
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
    parser.append!(args.survey_id)
  end

  desc 'Extend and existing Survey and then import  Content'
  task :extend, [:file, :user_email, :is_mmg, :verbose, :survey_id] => :environment do |_t, args|
    user = User.find_by(email: args.user_email)
    if user.nil?
      STDERR.puts "Unable to find user #{args.user_email}"
      exit(-1)
    end
    import_type = 'mmg'
    parser = SDP::Importers::Spreadsheet.new(args.file, user, import_type, config)
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
    parser.extend!(args.survey_id)
  end
end
