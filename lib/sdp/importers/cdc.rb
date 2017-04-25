module SDP
  module Importers
    module CDC
      SYSTEM_NAME_INDEX = 2
      STATUS_INDEX = 9
      SUPPORT_TYPE_INDEX = 17
      ABBREVIATION_INDEX = 95
      PROGRAM_INDEX = 128

      def self.import_programs(program_csv_file)
        CSV.foreach(program_csv_file, headers: :first_row) do |row|
          SurveillanceProgram.find_or_create_by!(row.to_hash)
        end
      end

      def self.import_systems(system_csv_file)
        CSV.foreach(system_csv_file, headers: :first_row) do |row|
          SurveillanceSystem.find_or_create_by!(row.to_hash)
        end
      end

      def self.import_enterprise_data_spreadsheet(excelx_file)
        programs = []
        xlsx = Roo::Spreadsheet.open(excelx_file)
        sheet = xlsx.sheet(0)
        (sheet.first_row + 2).upto(sheet.last_row) do |i|
          next unless sheet.row(i)[STATUS_INDEX] == 'Active' && sheet.row(i)[SUPPORT_TYPE_INDEX] == 'Mission Support'
          SurveillanceSystem.find_or_create_by!(name: sheet.row(i)[SYSTEM_NAME_INDEX], acronym: sheet.row(i)[ABBREVIATION_INDEX])
          if !programs.include?(sheet.row(i)[PROGRAM_INDEX]) && sheet.row(i)[PROGRAM_INDEX].respond_to?(:strip)
            programs << sheet.row(i)[PROGRAM_INDEX]
          end
        end
        write_out_programs(programs)
      end

      def self.write_out_programs(programs)
        programs.compact.each do |p|
          program_name = p.strip
          acronym = nil
          # If the program name has the acronym in parens, then pull out the
          # acronym and strip it from the name
          md = program_name.match(/\((\w+)\)/)
          if md
            acronym = md[1]
            program_name = program_name.split('(')[0].strip
          end
          SurveillanceProgram.create!(name: program_name, acronym: acronym) unless SurveillanceProgram.find_by(name: program_name)
        end
      end
    end
  end
end
