module SDP
  module Importers
    class Redcap
      attr_accessor :xml
      attr_accessor :user

      def intialize(xml, user)
        @xml = parse_document(xml)
        @user = user
      end

      def import
      end

      def import_forms
      end

      def import_form_questions
      end

      def import_response_sets
      end

      def import_questions
      end

      def import_responses
      end

      def parse_document(xml)
        doc = Nokogiri::XML(xml)
        doc.root.add_namespace_definition('odm', 'http://www.cdisc.org/ns/odm/v1.3')
        doc.root.add_namespace_definition('ds', 'http://www.w3.org/2000/09/xmldsig#')
        doc.root.add_namespace_definition('xsi', 'http://www.w3.org/2001/XMLSchema-instance')
        doc.root.add_namespace_definition('redcap', 'https://projectredcap.org')
        doc
      end
    end
  end
end
