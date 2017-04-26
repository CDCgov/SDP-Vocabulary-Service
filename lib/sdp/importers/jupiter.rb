module SDP
  module Importers
    module Jupiter
      def self.request(url)
        items = []
        response = HTTParty.get(url)
        response['nodedataarr'].each do |ss|
          name = ss['name']
          description = nil
          purpose = ss['attributes'].find { |a| a['key'] == 'purpose' }
          description = purpose['value'] if purpose && purpose['value'].present? && purpose['value'] != 'N/A'
          items << { name: name, description: description }
        end
        items
      end
    end
  end
end
