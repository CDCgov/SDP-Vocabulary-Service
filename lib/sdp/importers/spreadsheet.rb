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

    class DataElement
      attr_accessor :name, :description, :data_type, :program_var, :de_id, :de_code_system,
                    :category, :subcategory, :value_set, :concepts,
                    :value_set_url, :value_set_oid, :value_set_tab_name, :tag_tab_name

      def initialize(vads_oid_regex, coded_data_types, response_types)
        @vads_oid_regex = vads_oid_regex
        @coded_data_types = coded_data_types
        @response_types = response_types
      end

      def normalize(str)
        str.strip if str.respond_to?(:strip)
      end

      def coded?
        @coded_data_types.include?(@data_type)
      end

      def extract(row)
        @name = normalize(row[:name])
        @description = normalize(row[:description])
        @data_type = normalize(row[:data_type])
        @program_var = normalize(row[:program_var])
        @value_set = normalize(row[:value_set])
        @concepts = []
        if row[:value_set].respond_to? :to_uri
          @value_set_url = row[:value_set].to_uri
          oid_matcher = @vads_oid_regex.match(row[:value_set])
          @value_set_oid = oid_matcher[1] if oid_matcher
        end
      end

      def to_question(user)
        q = Question.new(
          content: @name, description: @description,
          created_by: user, response_type: response_type(@data_type)
        )
        q
      end

      def response_type(query)
        rt = ResponseType.find_by(query)
        raise "Unable to find response type #{query.values.first} - did response types change?" unless rt
        rt
      end
    end

    class MMGDataElement < DataElement
      def extract(row)
        super
        @de_id = normalize(row[:de_id])
        @de_code_system = normalize(row[:de_code_system])
        if row[:value_set].present?
          @value_set_tab_name = normalize(row[:value_set])
        end
      end

      def to_question(user)
        q = super
        code_sys = @de_code_system || ''
        q.concepts << Concept.new(value: @de_id, display_name: 'Data Element Identifier', code_system: code_sys) if @de_id.present?
        q
      end

      def response_type(type)
        response_type_code = @response_types[type]
        super(code: response_type_code)
      end

      def create_response_set(user)
        rs = ResponseSet.new(
          created_by: user, status: 'draft',
          name: @value_set_tab_name,
          source: 'local'
        )
        rs.save!
        @value_set.each do |code|
          rs.responses.create(code_system: code[:code_system_oid], display_name: code[:name], value: code[:code])
        end
        rs
      end
    end

    class GenericSSDataElement < DataElement
      def extract(row)
        super
        @category = normalize(row[:category]),
                    @subcategory = normalize(row[:subcategory])
        @tag_tab_name = normalize(row[:tag_table]) if row[:tag_table].present?
        if row[:value_set] == 'Local' && row[:value_set_table].present?
          @value_set_tab_name = normalize(row[:value_set_table])
        end
      end

      def to_question(user)
        q = super
        q.category = Category.find_by(name: @category) if @category.present?
        q.subcategory = Subcategory.find_by(name: @subcategory) if @subcategory.present?
        q
      end

      def response_type(name)
        super(name: name)
      end

      def create_response_set(user)
        vs_meta = @value_set.first
        vs_meta ||= {}
        rs_name = vs_meta[:name] || @value_set_tab_name
        rs = ResponseSet.new(
          created_by: user, status: 'draft',
          name: rs_name,
          source: 'local',
          description: vs_meta[:description]
        )
        rs.save!
        @value_set.each do |code|
          rs.responses.create(code_system: code[:system], display_name: code[:display_name], value: code[:value])
        end
        rs
      end
    end

    class MarkerRow
      START_REGEX = /^(BEGIN|START|start):? (.*)/
      END_REGEX = /^(END|end):? (.*)/
      NOTE_REGEX = /^(NOTE|end):? (.*)/

      attr_accessor :type, :text, :error

      def initialize(row_contents)
        trimmed_contents = row_contents.strip
        { section_start: START_REGEX, section_end: END_REGEX, note: NOTE_REGEX }.each_pair do |k, v|
          match_result = v.match(trimmed_contents)
          next unless match_result
          self.type = k
          self.text = match_result[2]
          break
        end
        if text.blank?
          self.type = :error
          self.error = 'Unable to find marker prefix'
        else
          splits = text.split(/:|NOTE:/)
          if splits.length > 1 && splits[1].length >= 30
            self.text = splits[0].strip
          end
        end
      end
    end

    class Spreadsheet
      attr_reader :errors
      attr_reader :warnings

      DEFAULT_CONFIG = {
        mmg: true,
        de_tab_name: 'Data Elements',
        de_coded_type: ['Coded'],
        phin_vads_oid_regex: '.*oid=(.*)(&.*)*',
        de_columns: {
          section_name: 'PHIN Variable',
          name: 'Data Element (DE) Name',
          de_id: 'DE Identifier Sent in HL7 Message',
          de_code_system: 'DE Code System',
          description: 'Data Element Description',
          value_set: 'Value Set Name (VADS Hyperlink)',
          program_var: /(PHIN|Local) Variable Code System/,
          data_type: 'Data Type'
        },
        gs_columns: {
          program_var: 'Program Defined Variable Name (O)',
          name: 'Question Text (R)',
          description: 'Question Description (R)',
          category: 'Question Category (O)',
          subcategory: 'Question Subcategory (O)',
          data_type: 'Question Response Type (R)',
          tag_table: 'Question Tag Table (O)',
          value_set_table: 'Local Response Set Table (C)',
          value_set: 'Response Set Source (C)'
        },
        vs_columns: {
          code: 'Concept Code',
          name: 'Concept Name',
          code_system_oid: 'Code System OID',
          code_system_name: 'Code System Name',
          code_system_version: 'Code System Version'
        },
        rs_columns: {
          name: 'Response Set Name',
          description: 'Response Set Description',
          display_name: 'Display Name',
          value: 'Response',
          system: 'Code System Identifier (optional)'
        },
        tag_columns: {
          name: 'Tag Name (R)',
          value: 'Tag Value (R)',
          system: 'Code System Identifier (O)'
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
        @warnings = []
        @top_level = NestedItem.new(:section)
        @top_level.name = 'Top Level'
        @current_section = @top_level
        @parent_sections = []
        @config = DEFAULT_CONFIG.deep_merge(config)
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
        s
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
        w = Roo::Spreadsheet.open(@file, extension: 'xlsx')
        @all_sheets = w.sheets

        @all_sheets.each do |sheet|
          headers = []
          unless w.sheet(sheet).first_row
            @warnings << "Sheet #{sheet} skipped because it is blank" # Do not think this can  be reached - caught earlier
            next
          end
          w.sheet(sheet).row(1).each do |header|
            headers << header
          end
          if (@config[:vs_columns].values - headers).empty? ||
             @valueset_sheet.match(sheet)
            logger.debug "skipping sheet #{sheet} -- looks like a value set"
            next
          elsif (@config[:rs_columns].values - headers).empty?
            logger.debug "skipping sheet #{sheet} -- looks like a response set"
            next
          elsif !de_sheet?(headers)
            logger.debug "skipping tab #{sheet} -- looks like it does not contain form data elements"
            @warnings << " '#{sheet}' tab does not contain expected MMG column names"\
            ' and will not be imported. Refer to the table in the "Import Content" '\
            'Help Documentation for more info.' # warning
            next
          end

          logger.debug "processing sheet #{sheet}"
          w.sheet(sheet).parse(column_names).each do |row|
            # skip first row
            next if row[:name] == column_names[:name]
            # section start/end
            if row[:data_type].nil?
              process_section_marker(row)
              next
            end
            data_element = extract_data_element(sheet, row)
            print_data_element(data_element) if verbose

            # add the data element unless a matching data element is already present
            ni = NestedItem.new
            ni.data_element = data_element
            @current_section.add_item(ni) unless @current_section.items.map(&:data_element).include? data_element
          end
          sectionize_top_level_questions(sheet)
          # Reset to top level to prevent mismatched sections causing issues
          @current_section = @top_level
        end
        # Go back and extract value sets when those are included in the workbook
        extract_value_sets(w, verbose)
        extract_tags(w, verbose)
        w.close
      end

      # Should only be called after parse!
      def sections_exist?
        @top_level.items.present?
      end

      # Should only be called after parse!
      def top_level_section_count
        @top_level.items.size
      end

      private

      def column_names
        if @config[:mmg]
          @config[:de_columns]
        else
          @config[:gs_columns]
        end
      end

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
            concepts = nil
            if item.data_element.value_set_oid
              rs = response_set_for_vads(item.data_element)
            elsif item.data_element.value_set_tab_name.present?
              rs = response_set_for_local(item.data_element)
            end
            if item.data_element.tag_tab_name.present?
              concepts = item.data_element.concepts
            end
            q = item.data_element.to_question(@user)
            q.save!
            q.question_response_sets.create(response_set: rs) if rs
            q.concepts << concepts if concepts
            nsi = SectionNestedItem.new(question: q, program_var: item.data_element.program_var, response_set: rs, position: i)
            parent_section.section_nested_items << nsi
          else
            section = Section.new(name: item.name || "Imported Section ##{i + 1}", created_by: @user)
            section.concepts << Concept.new(display_name: 'MMG Tab Name', value: @config[:de_tab_name])
            section.parent = parent_section
            section.save!
            nsi = SectionNestedItem.new(nested_section: section, position: i)
            parent_section.section_nested_items << nsi
            save_section_items(section, item.items)
          end
        end
      end

      def response_set_for_vads(element)
        rs = ResponseSet.most_recent_for_oid(element.value_set_oid)
        if rs.nil?
          rs = ResponseSet.new(
            created_by: @user, status: 'draft',
            name: element.value_set_tab_name || element.name,
            source: 'PHIN_VADS', oid: element.value_set_oid
          )
          rs.save!
        end
        rs
      end

      def response_set_for_local(element)
        rs = @local_response_sets[element.value_set_tab_name]
        unless rs
          rs = element.create_response_set(@user)
          @local_response_sets[element.value_set_tab_name] = rs
        end
        rs
      end

      def parse_value_set(sheet, name)
        value_set = []
        begin
          vs_column_names = if @config[:mmg]
                              @config[:vs_columns]
                            else
                              @config[:rs_columns]
                            end
          sheet.each(vs_column_names) do |entry|
            # skip first row
            next if entry[:name] == vs_column_names[:name]
            # skip rows without a code
            next if (entry[:code].nil? || entry[:code].to_s.strip.empty?) &&
                    (entry[:display_name].nil? || entry[:display_name].to_s.strip.empty?)
            value_set << entry
          end
        rescue Roo::HeaderRowNotFoundError
          if sheet.header_line == 1
            @warnings << "On '#{sheet}' tab there is a missing header row in #{name}, retrying" # warning
            sheet.header_line = 2
            retry
          else
            @warnings << "Unable to process value set from #{name} in tab #{sheet} as no header rows found" # warning
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

      def extract_tags(workbook, verbose)
        all_data_elements.each do |data_element|
          next unless data_element.tag_tab_name
          next unless @all_sheets.include?(data_element.tag_tab_name)
          sheet = workbook.sheet(data_element.tag_tab_name)
          logger.info "Processing tag tab: #{data_element.tag_tab_name}" if verbose
          begin
            tag_columns = @config[:tag_columns]
            sheet.each(tag_columns) do |entry|
              # skip first row
              next if entry[:name] == tag_columns[:name]
              # skip rows without tag name and value
              next if entry[:name].nil? || entry[:name].to_s.strip.empty?
              data_element.concepts << Concept.new(value: entry[:value], display_name: entry[:name], code_system: entry[:system])
            end
          rescue Roo::HeaderRowNotFoundError # catching the error
            if sheet.header_line == 1
              @warnings << "On tab '#{sheet}' there is a missing header row in #{data_element.tag_tab_name}, retrying" # warning
              sheet.header_line = 2
              retry
            else
              @warnings << "For tab '#{sheet}' Unable to parse tags from #{data_element.tag_tab_name}" # warning
            end
          end
        end
      end

      def extract_value_sets(workbook, verbose)
        all_data_elements.each do |data_element|
          next unless data_element.value_set_tab_name
          vs_tab_name = @all_sheets.find { |sn| sn.strip == data_element.value_set_tab_name.strip }
          if @all_sheets.include?(vs_tab_name)
            sheet = workbook.sheet(vs_tab_name)
            logger.info "Processing value set tab: #{vs_tab_name}" if verbose
            data_element.value_set = parse_value_set(sheet, vs_tab_name)

            logger.info "  Codes: #{data_element.value_set.join(', ')}" if verbose
          else
            # sheet not present - create an empty response set
            data_element.value_set = []
          end
        end
      end

      def extract_data_element(sheet, row)
        data_element = if @config[:mmg]
                         MMGDataElement.new(@vads_oid, @config[:de_coded_type], @config[:response_types])
                       else
                         GenericSSDataElement.new(@vads_oid, @config[:de_coded_type], @config[:response_types])
                       end
        data_element.extract(row)
        if data_element.value_set_tab_name.present? && !@all_sheets.include?(data_element.value_set_tab_name)
          @warnings << "In tab '#{sheet}' on row '#{row[:name]}' Value set tab '#{data_element.value_set_tab_name}' not present" # warning
          # data_element.value_set_tab_name = nil
        end
        if data_element.tag_tab_name.present? && !@all_sheets.include?(data_element.tag_tab_name)
          @warnings << "In tab '#{sheet}' on row '#{row[:name]}' Tag tab '#{data_element.tag_tab_name}' not present" # warning
        end
        data_element
      end

      def process_section_marker(row)
        column_name = if @config[:mmg]
                        :section_name
                      else
                        :name
                      end
        row_contents = row[column_name]
        mr = MarkerRow.new(row_contents)
        case mr.type
        when :section_start
          start_section(mr.text)
        when :section_end
          if @current_section.name != mr.text
            @warnings << "Mismatched section end: expected #{@current_section.name}, found #{mr.text}"
          else
            @current_section = @parent_sections.pop
          end
        when :note
          logger.info("Found NOTE: #{mr.text}")
        when :error
          @warnings << "Unable to process marker row with contents #{row_contents}"
        end
      end

      def start_section(name)
        new_section = NestedItem.new(:section)
        new_section.name = name
        @current_section.add_item(new_section)
        @parent_sections.push(@current_section)
        @current_section = new_section
      end

      def print_data_element(data_element)
        logger.info data_element.name
        logger.info "  Type: #{data_element.data_type}"
        if data_element.value_set_url
          logger.info "  Value Set URL: #{data_element.value_set_url}"
        end
        if data_element.value_set_tab_name
          logger.info "  Value Set Tab: #{data_element.value_set_tab_name}"
        end
      end

      def logger
        Rails.logger
      end

      def de_sheet?(headers)
        column_names.values.all? do |column_name|
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
