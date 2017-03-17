module SDP
  module Importers
    module CDC
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
    end
  end
end
