module SDP
  module Importers
    class Spreadsheet
      attr_reader :errors

      DEFAULT_CONFIG = {
        de_tab_name: 'Data Elements',
        de_coded_type: ['Coded'],
        section_start_regex: '^START: (.*)',
        section_end_regex: '^END: (.*)',
        phin_vads_oid_regex: '.*oid=(.*)(&.*)*',
        de_columns: {
          section_name: 'PHIN Variable',
          name: 'Data Element (DE) Name',
          description: 'Data Element Description',
          value_set: 'Value Set Name (VADS Hyperlink)',
          program_var: 'Local Variable Code System',
          data_type: 'Data Type'
        },
        vs_columns: {
          code: 'Concept Code',
          name: 'Concept Name',
          code_system_oid: 'Code System OID',
          code_system_name: 'Code System Name',
          code_system_version: 'Code System Version'
        },
        response_types: {
          'Date' => :date,
          'Coded' => :choice,
          'Numeric' => :decimal,
          'Text' => :text
        }
      }.freeze

      def initialize(file, user, config = {})
        @file = file
        @user = user
        @errors = []
        @section_names = []
        @sections = {}
        @config = DEFAULT_CONFIG.deep_merge(config)
        @section_start = Regexp.new(@config[:section_start_regex])
        @section_end = Regexp.new(@config[:section_end_regex])
        @vads_oid = Regexp.new(@config[:phin_vads_oid_regex])
        @local_response_sets = {}
      end

      def save!
        s = Survey.new(name: @config[:survey_name] || @file, created_by: @user)
        s.save!
        f_position = 0
        sections do |name, elements|
          f = Form.new(name: name || "Imported Form ##{f_position + 1}", created_by: @user)
          f.save!
          s.survey_forms.create(form: f, position: f_position += 1)
          q_position = 0
          elements.each do |element|
            rs = nil
            if element[:value_set_oid]
              rs = response_set_for_vads(element)
            elsif element[:value_set]
              rs = response_set_for_local(element)
            end
            q = question_for(element)
            q.save!
            q.question_response_sets.create(response_set: rs) if rs
            f.form_questions.create(question: q, program_var: element[:program_var], response_set: rs, position: q_position += 1)
            q.index
          end
          UpdateIndexJob.perform_now('form', f)
        end
        UpdateIndexJob.perform_now('survey', s)
      end

      def parse!(verbose = false)
        w = Roo::Spreadsheet.open(@file)
        @all_sheets = w.sheets
        w.sheet(@config[:de_tab_name]).each(@config[:de_columns]) do |row|
          # skip first row
          next if row[:name] == @config[:de_columns][:name]

          # section start/end
          if row[:name].nil?
            process_section_marker(row)
            next
          end

          data_element = extract_data_element(row)
          print_data_element(data_element) if verbose

          section_name = @section_names.last
          # initialize section if its not already there
          @sections[section_name] ||= { name: section_name, data_elements: [] }
          # add the data element unless a matching data element is already present
          @sections[section_name][:data_elements] << data_element unless @sections[section_name][:data_elements].include? data_element
        end

        # Go back and extract value sets when those are included in the workbook
        extract_value_sets(w, verbose)
        w.close
      end

      def sections
        @sections.each_value do |section|
          yield section[:name], section[:data_elements]
        end
      end

      private

      def response_type(type)
        response_type_code = @config[:response_types][type]
        rt = ResponseType.find_by(code: response_type_code)
        raise "Unable to find response type #{response_type_code} - did response types change?" unless rt
        rt
      end

      def question_for(element)
        Question.new(
          content: element[:name], description: element[:description],
          created_by: @user, response_type: response_type(element[:data_type])
        )
      end

      def response_set_for_vads(element)
        rs = ResponseSet.where(oid: element[:value_set_oid]).first
        if rs.nil?
          rs = ResponseSet.new(
            created_by: @user, status: 'draft',
            name: element[:value_set_tab_name] || element[:name],
            source: 'PHIN_VADS', oid: element[:value_set_oid]
          )
          rs.save!
        end
        rs
      end

      def response_set_for_local(element)
        @local_response_sets[element[:value_set_tab_name]] || create_response_set_for_local(element)
      end

      def create_response_set_for_local(element)
        rs = ResponseSet.new(
          created_by: @user, status: 'draft',
          name: element[:value_set_tab_name],
          source: 'local'
        )
        rs.save!
        element[:value_set].each do |code|
          rs.responses.create(code_system: code[:code_system_oid], display_name: code[:name], value: code[:code])
        end
        @local_response_sets[element[:value_set_tab_name]] = rs
      end

      def parse_value_set(sheet, name)
        value_set = []
        begin
          sheet.each(@config[:vs_columns]) do |entry|
            # skip first row
            next if entry[:name] == @config[:vs_columns][:name]
            # skip rows without a code
            next if entry[:code].nil? || entry[:code].to_s.strip.empty?
            value_set << entry
          end
        rescue Roo::HeaderRowNotFoundError
          if sheet.header_line == 1
            @errors << "Missing header row in #{name}, retrying"
            sheet.header_line = 2
            retry
          else
            @errors << "Unable to parse value set from #{name}"
          end
        end
        value_set
      end

      def extract_value_sets(workbook, verbose)
        sections do |_name, data_elements|
          data_elements.each do |data_element|
            next unless data_element[:value_set_tab_name]
            sheet = workbook.sheet(data_element[:value_set_tab_name])
            logger.info "Processing value set tab: #{data_element[:value_set_tab_name]}" if verbose
            data_element[:value_set] = parse_value_set(sheet, data_element[:value_set_tab_name])
            logger.info "  Codes: #{data_element[:value_set].join(', ')}" if verbose
          end
        end
      end

      def extract_data_element(row)
        data_element = {
          name: normalize(row[:name]), description: normalize(row[:description]),
          data_type: normalize(row[:data_type]), program_var: normalize(row[:program_var])
        }
        if @config[:de_coded_type].include? data_element[:data_type]
          if row[:value_set].respond_to? :to_uri
            data_element[:value_set_url] = row[:value_set].to_uri
            oid_matcher = @vads_oid.match(data_element[:value_set_url].to_s)
            data_element[:value_set_oid] = oid_matcher[1] if oid_matcher
          elsif !row[:value_set].nil?
            tab_name = normalize(row[:value_set])
            if @all_sheets.include? tab_name
              # can't access a different sheet mid-parse so just save tab name for now
              data_element[:value_set_tab_name] = normalize(row[:value_set])
            else
              @errors << "Value set tab '#{tab_name}' not present"
            end
          end
        end
        data_element
      end

      def process_section_marker(row)
        start_marker = @section_start.match(row[:section_name])
        end_marker = @section_end.match(row[:section_name])
        if start_marker
          @section_names.push(start_marker[1])
        elsif end_marker
          section_name = end_marker[1]
          current_section = @section_names.pop
          if current_section != section_name
            @errors << "Mismatched section end: expected #{current_section}, found #{section_name}"
          end
        end
      end

      def normalize(str)
        str.strip if str
      end

      def print_data_element(data_element)
        logger.info data_element[:name]
        logger.info "  Type: #{data_element[:data_type]}"
        if data_element[:value_set_url]
          logger.info "  Value Set URL: #{data_element[:value_set_url]}"
        end
        if data_element[:value_set_tab_name]
          logger.info "  Value Set Tab: #{data_element[:value_set_tab_name]}"
        end
      end
    end
  end
end
