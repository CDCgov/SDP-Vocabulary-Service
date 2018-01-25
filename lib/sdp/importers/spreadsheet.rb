module SDP
  module Importers
    class NestedItem
      attr_accessor :name, :type, :items, :data_element

      def initialize(type = :data_element)
        @name = name
        @type = type
        @items = []
      end

      def add_item(item)
        @items << item
      end
    end

    class Spreadsheet
      attr_reader :errors

      DEFAULT_CONFIG = {
        mmg: true,
        de_tab_name: 'Data Elements',
        de_coded_type: ['Coded'],
        section_start_regex: '^START: (.*)',
        section_end_regex: '^END: (.*)',
        phin_vads_oid_regex: '.*oid=(.*)(&.*)*',
        de_columns: {
          section_name: 'PHIN Variable',
          name: 'Data Element (DE) Name',
          de_id: 'DE Identifier Sent in HL7 Message',
          description: 'Data Element Description',
          value_set: 'Value Set Name (VADS Hyperlink)',
          program_var: /(PHIN|Local) Variable Code System/,
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
          'Text' => :text,
          'Date/time' => :dateTime
        }
      }.freeze

      def initialize(file, user, config = {})
        @file = file
        @user = user
        @errors = []
        @top_level = NestedItem.new(:section)
        @top_level.name = 'Top Level'
        @current_section = @top_level
        @parent_sections = []
        @config = DEFAULT_CONFIG.deep_merge(config)
        @section_start = Regexp.new(@config[:section_start_regex])
        @section_end = Regexp.new(@config[:section_end_regex])
        @vads_oid = Regexp.new(@config[:phin_vads_oid_regex])
        @oid_matcher = /^([\.\d]+)$/
        @valueset_sheet = /Valueset.*/
        @local_response_sets = {}
      end

      def save!
        s = Survey.new(name: @config[:survey_name] || @file, created_by: @user)
        s.save!
        section_position = 0
        save_survey_items(s, section_position)
      end

      def append!(survey_id)
        s = Survey.find(survey_id)
        section_position = 0
        section_position = s.survey_sections.last.position if s.survey_sections.present?
        save_survey_items(s, section_position + 1)
      end

      def extend!(survey_id)
        original = Survey.find(survey_id)
        s = Survey.new(name: @config[:survey_name] || @file, created_by: @user, parent_id: original.id)
        section_position = 0
        original.survey_sections.each_with_index do |ss, i|
          s.survey_sections << SurveySection.new(section_id: ss.section_id, position: ss.position)
          section_position = i
        end
        s.surveillance_system  = @user.last_system
        s.surveillance_program = @user.last_program
        s.save!
        save_survey_items(s, section_position + 1)
      end

      def parse!(verbose = false)
        w = Roo::Spreadsheet.open(@file)
        @all_sheets = w.sheets
        @all_sheets.each do |sheet|
          headers = []
          w.sheet(sheet).row(1).each do |header|
            headers << header
          end
          if (@config[:vs_columns].values - headers).empty? ||
             @valueset_sheet.match(sheet)
            logger.debug "skipping sheet #{sheet} -- looks like a value set"
            next
          elsif !de_sheet?(headers)
            logger.debug "skipping sheet #{sheet} -- looks like it does not contain form data elements"
            next
          end

          logger.debug "processing sheet #{sheet}"
          if @config[:mmg]
            w.sheet(sheet).parse(@config[:de_columns]).each do |row|
              # skip first row
              next if row[:name] == @config[:de_columns][:name]
              # section start/end
              if row[:name].nil?
                process_section_marker(row)
                next
              end
              data_element = extract_data_element(row)
              print_data_element(data_element) if verbose

              # add the data element unless a matching data element is already present
              ni = NestedItem.new
              ni.data_element = data_element
              @current_section.add_item(ni) unless @current_section.items.map(&:data_element).include? data_element
            end
            sectionize_top_level_questions(sheet)
          else
            start_section(sheet)
            w.sheet(sheet).parse(@config[:de_columns]).each do |row|
              # skip first row
              next if row[:name] == @config[:de_columns][:name]
              next if row[:name].nil?

              data_element = extract_data_element(row)
              print_data_element(data_element) if verbose
              ni = NestedItem.new
              ni.data_element = data_element
              @current_section.add_item(ni) unless @current_section.items.map(&:data_element).include? data_element
            end
            @current_section = @parent_sections.pop
          end
        end
        # Go back and extract value sets when those are included in the workbook
        extract_value_sets(w, verbose)
        w.close
      end

      private

      def save_survey_items(s, section_position)
        @top_level.items.each do |nested_item|
          if nested_item.type == :data_element
          end
          section = Section.new(name: nested_item.name || "Imported Section ##{section_position + 1}", created_by: @user)
          section.concepts << Concept.new(display_name: 'MMG Tab Name', value: @config[:de_tab_name])
          section.save!
          s.survey_sections.create(section: section, position: section_position)
          section_position += 1
          save_section_items(section, nested_item.items)
          UpdateIndexJob.perform_now('section', section)
        end
        UpdateIndexJob.perform_now('survey', s)
      end

      def save_section_items(parent_section, items)
        items.each_with_index do |item, i|
          if item.type == :data_element
            rs = nil
            if item.data_element[:value_set_oid]
              rs = response_set_for_vads(item.data_element)
            elsif item.data_element[:value_set]
              rs = response_set_for_local(item.data_element)
            end
            q = question_for(item.data_element)
            q.save!
            q.question_response_sets.create(response_set: rs) if rs
            nsi = SectionNestedItem.new(question: q, program_var: item.data_element[:program_var], response_set: rs, position: i)
            parent_section.section_nested_items << nsi
          else
            section = Section.new(name: item.name || "Imported Section ##{i + 1}", created_by: @user)
            section.concepts << Concept.new(display_name: 'MMG Tab Name', value: @config[:de_tab_name])
            section.save!
            nsi = SectionNestedItem.new(nested_section: section, position: i)
            parent_section.section_nested_items << nsi
            save_section_items(section, item.items)
          end
        end
      end

      def response_type(type)
        response_type_code = @config[:response_types][type]
        rt = ResponseType.find_by(code: response_type_code)
        raise "Unable to find response type #{type} - did response types change?" unless rt
        rt
      end

      def question_for(element)
        q = Question.new(
          content: element[:name], description: element[:description],
          created_by: @user, response_type: response_type(element[:data_type])
        )
        q.concepts << Concept.new(value: element[:de_id], display_name: 'Data Element Identifier') if element[:de_id].present?
        q
      end

      def response_set_for_vads(element)
        rs = ResponseSet.most_recent_for_oid(element[:value_set_oid])
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

      def all_data_elements
        data_elements_for_section(@top_level)
      end

      def data_elements_for_section(section)
        data_elements = []
        section.items.each do |item|
          if item.type == :data_element
            data_elements << item.data_element
          else
            data_elements.concat(data_elements_for_section(item))
          end
        end
        data_elements
      end

      def sectionize_top_level_questions(sheet)
        new_items = []
        current_top_level_section = nil
        @top_level.items.each do |i|
          if i.type == :section
            if current_top_level_section
              new_items << current_top_level_section
              current_top_level_section = nil
            end
            new_items << i
          else
            if current_top_level_section.blank?
              current_top_level_section = NestedItem.new(:section)
              current_top_level_section.name = sheet
            end
            current_top_level_section.items << i
          end
        end
        @top_level.items = new_items
      end

      def extract_value_sets(workbook, verbose)
        all_data_elements.each do |data_element|
          next unless data_element[:value_set_tab_name]
          sheet = workbook.sheet(data_element[:value_set_tab_name])
          logger.info "Processing value set tab: #{data_element[:value_set_tab_name]}" if verbose
          data_element[:value_set] = parse_value_set(sheet, data_element[:value_set_tab_name])
          logger.info "  Codes: #{data_element[:value_set].join(', ')}" if verbose
        end
      end

      def extract_data_element(row)
        data_element = {
          name: normalize(row[:name]), description: normalize(row[:description]),
          data_type: normalize(row[:data_type]), program_var: normalize(row[:program_var]),
          de_id: normalize(row[:de_id])
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
          start_section(start_marker[1])
        elsif end_marker
          section_name = end_marker[1]
          if @current_section.name != section_name
            @errors << "Mismatched section end: expected #{current_section}, found #{section_name}"
          end
          @current_section = @parent_sections.pop
        end
      end

      def start_section(name)
        new_section = NestedItem.new(:section)
        new_section.name = name
        @current_section.add_item(new_section)
        @parent_sections.push(@current_section)
        @current_section = new_section
      end

      def normalize(str)
        str.strip if str.respond_to?(:strip)
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

      def logger
        Rails.logger
      end

      def de_sheet?(headers)
        @config[:de_columns].values.all? do |column_name|
          if column_name.is_a?(Regexp)
            headers.any? { |h| column_name.match?(h) }
          else
            headers.include?(column_name)
          end
        end
      end
    end
  end
end
