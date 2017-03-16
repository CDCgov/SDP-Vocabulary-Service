module SDP
  module Importers
    module CDC
      def self.import_programs(program_csv_file)
        CSV.foreach(program_csv_file, headers: :first_row) do |row|
          SurveillanceProgram.create!(row.to_hash)
        end
      end
    end
  end
end
