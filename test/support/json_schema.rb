require 'rails/test_help'
require 'json-schema'
module ActiveSupport
  class TestCase
    class SchemaReader < ::JSON::Schema::Reader
      def read(location)
        match = location.to_s.match(%r{(^http://hl7.org/fhir/json-schema/)(.*)})
        if match
          resource_name = match[2].gsub('.schema.json', '')
          file = File.join(__dir__, 'schemas', 'fhir', "#{resource_name}.schema.json")
          body = read_file(file)
          return ::JSON::Schema.new(::JSON::Validator.parse(body), ::JSON::Util::URI.parse(location.to_s))
        else
          super
        end
      end
    end

    def schema_reader
      @@schema_reader ||= SchemaReader.new
    end

    def assert_json_schema(schema_file, data)
      schema_file = File.join(__dir__, 'schemas', schema_file)
      assert ::JSON::Validator.validate!(schema_file, data, schema_reader: schema_reader)
    end

    def assert_json_schema_response(schema)
      assert_json_schema(schema, ::JSON.parse(response.body))
    end
  end
end

module JSON
  class Validator
    @@currently_loading = []
    def load_ref_schema(parent_schema, ref)
      schema_uri = JSON::Util::URI.absolutize_ref(ref, parent_schema.uri)
      return true if self.class.schema_loaded?(schema_uri) ||
                     @@currently_loading.index(schema_uri)
      @@currently_loading << schema_uri
      validator = self.class.validator_for_uri(schema_uri, false)
      schema_uri = JSON::Util::URI.file_uri(validator.metaschema) if validator

      schema = @options[:schema_reader].read(schema_uri)
      self.class.add_schema(schema)
      build_schemas(schema)
    end
  end
end
