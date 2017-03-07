module SDP
  module Importers
		class Spreadsheet
			attr_reader :errors

			def initialize(file, user, config = {})
				@file = file
				@user = user
				@errors = []
				@sections = {}
				@config = {
					:de_tab_name => 'Data Elements',
					:de_coded_type => ['Coded'],
					:section_start_regex => '^START: (.*)',
					:section_end_regex => '^END: (.*)',
					:de_columns => {
						:section_name => 'PHIN Variable',
						:name => 'Data Element (DE) Name',
						:description => 'Data Element Description',
						:value_set => 'Value Set Name (VADS Hyperlink)',
						:data_type => 'Data Type'
					},
					:vs_columns => {
						:code => 'Concept Code',
						:name => 'Concept Name',
						:code_system_oid => 'Code System OID',
						:code_system_name => 'Code System Name',
						:code_system_version => 'Code System Version'
					}
				}
				@config.deep_merge!(config)
				@section_start = Regexp.new(@config[:section_start_regex])
				@section_end = Regexp.new(@config[:section_end_regex])
			end
			
			def save!
				f = Form.new
				f.name = @file
				f.created_by = @user
				f.save!
				sections do |name, elements|
					elements.each do |element|
						q = Question.new
						q.content = element[:name]
						q.description = element[:description]
						q.created_by = @user
						q.save!
						if element[:value_set_url] || element[:value_set]
							rs = ResponseSet.new
							rs.created_by = @user
							rs.status = 'draft'
							rs.name = element[:value_set_tab_name] || element[:name]
							rs.save!
# 							if element[:value_set_url]
# 								rs.coded = false
# 								rs.source = element[:value_set_url]
# 							end
# 							if element[:value_set]
# 								rs.coded = true
# 								element[:value_set].each do |code|
# 									rs.responses.create(:code_system => code[:code_system_oid], :display_name => code[:name], :value => code[:code])
# 								end
# 							end
# 							rs.save!
						end
						f.form_questions.create(:question => q, :response_set => rs)
					end
				end
			end
	
			def parse!(verbose = false)
				w = Roo::Spreadsheet.open(@file)
				all_sheets = w.sheets
				section_names = []
				w.sheet(@config[:de_tab_name]).each(@config[:de_columns]) do |row|
					# skip first row
					next if row[:name] == @config[:de_columns][:name]

					# section start/end
					if row[:name].nil?
						if m=@section_start.match(row[:section_name])
							section_name = m[1]
							section_names.push(section_name)
						elsif m=@section_end.match(row[:section_name])
							section_name = m[1]
							current_section = section_names.pop
							if current_section != section_name
								@errors << "Mismatched section end: expected #{current_section}, found #{section_name}"
							end
						end
						next
					end
		
					data_element = {}
					data_element[:name] = normalize(row[:name])
					data_element[:description] = normalize(row[:description])
					data_element[:data_type] = normalize(row[:data_type])
					if @config[:de_coded_type].include? data_element[:data_type]
						if row[:value_set].respond_to? :to_uri
							data_element[:value_set_url] = row[:value_set].to_uri
						elsif !row[:value_set].nil?
							tab_name = normalize(row[:value_set])
							if all_sheets.include? tab_name
								# can't access a different sheet mid-parse so just save tab name for now
								data_element[:value_set_tab_name] = normalize(row[:value_set])
							else
								@errors << "Value set tab '#{tab_name}' not present"
							end
						end
					end

					print_data_element(data_element) if verbose
					section_name = section_names.last
					# initialize section if its not already there
					@sections[section_name] ||= {:name => section_name, :data_elements => []}
					# add the data element unless a matching data element is already present
					if !@sections[section_name][:data_elements].include? data_element
						@sections[section_name][:data_elements] << data_element
					end
				end

				# Go back and extract value sets when those are included in the workbook
				sections do |name, data_elements|
					data_elements.each do |data_element|
						if data_element[:value_set_tab_name]
							sheet = w.sheet(data_element[:value_set_tab_name])
							puts "Processing value set tab: #{data_element[:value_set_tab_name]}" if verbose
							data_element[:value_set] = parse_value_set(sheet, data_element[:value_set_tab_name])
							puts "  Codes: #{data_element[:value_set].join(', ')}" if verbose
						end
					end
				end
				w.close		
			end
	
			def sections
				@sections.each_value do |section|
					yield section[:name], section[:data_elements]
				end
			end
	
			private
	
			def parse_value_set(sheet, name)
				value_set = []
				begin
					sheet.each(@config[:vs_columns]) do |entry|
						# skip first row
						next if entry[:name] == @config[:vs_columns][:name]
						# skip rows without a code
						next if entry[:code].nil? || entry[:code].to_s.strip.length==0
						value_set << entry
					end
				rescue Roo::HeaderRowNotFoundError
					if sheet.header_line == 1
						@errors <<  "Missing header row in #{name}, retrying"
						sheet.header_line = 2
						retry
					else
						@errors << "Unable to parse value set from #{name}"
					end
				end
				value_set
			end
	
			def normalize(str)
				if str
					str.strip
				else
					nil
				end
			end
	
			def print_data_element(data_element)
				puts "#{data_element[:name]}"
				puts "  Type: #{data_element[:data_type]}"
				if data_element[:value_set_url]
					puts "  Value Set URL: #{data_element[:value_set_url]}"
				end
				if data_element[:value_set_tab_name]
					puts "  Value Set Tab: #{data_element[:value_set_tab_name]}"
				end
			end
		end
	end
end
