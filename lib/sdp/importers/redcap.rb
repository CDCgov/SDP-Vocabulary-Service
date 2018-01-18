module SDP
  module Importers
    class Redcap
      attr_accessor :xml
      attr_accessor :user
      def initialize(xml, user)
        @xml = parse_document(xml)
        @user = user
      end

      def import
        parse.each_pair do |_k, v|
          v.save
        end
      end

      def parse
        response_sets = parse_response_sets
        questions = parse_questions(response_sets)
        item_groups = parse_item_groups(questions)
        sections = parse_sections(item_groups)
        sections
      end

      def parse_sections(item_groups)
        sections = {}
        xml.xpath('//odm:SectionDef').each do |s|
          section = Section.new(name: s['Name'],
                                created_by: user)
          sections[s['OID']] = section
          s.xpath('./odm:ItemGroupRef').each do |igr|
            ig_questions = item_groups[igr['ItemGroupOID']]
            ig_questions.each_with_index do |q, i|
              section.section_nested_items << SectionNestedItem.new(question: q, response_set: q.response_sets[0], position: i)
            end
          end
        end
        sections
      end

      def parse_item_groups(questions)
        item_groups = {}
        xml.xpath('//odm:ItemGroupDef').each do |igd|
          item_groups[igd['OID']] = []
          igd.xpath('./odm:ItemRef').each do |ir|
            item_groups[igd['OID']] << questions[ir['ItemOID']]
          end
        end
        item_groups
      end

      def parse_response_sets
        code_lists = {}
        xml.xpath('//odm:CodeList').each do |cl_element|
          cl = ResponseSet.new(name: cl_element['Name'], created_by: user)
          code_lists[cl_element['OID']] = cl
          cl_element.xpath('./odm:CodeListItem').each do |item|
            value = item['CodedValue']
            display_name = item.at_xpath('./odm:Decode/odm:TranslatedText').text
            cl.responses << Response.new(value: (value || display_name),
                                         display_name: (display_name || value))
          end
        end
        code_lists
      end

      def parse_questions(response_sets)
        questions = {}
        xml.xpath('//odm:ItemDef').each do |q|
          question = Question.new(content: q.at_xpath('./odm:Question/odm:TranslatedText').text,
                                  created_by: user)
          type = q.attribute('FieldType')
          if type && %w(select yesno).index(type.value)
            question.response_type = ResponseType.where(code: 'choice').first
            clr = q.at_xpath('./odm:CodeListRef')
            question.response_sets << response_sets[clr['CodeListOID']] if clr
          else
            data_type = q.attribute('DataType')
            rt = if data_type && data_type.value == 'float'
                   ResponseType.where(code: 'decimal').first
                 elsif data_type
                   ResponseType.where(code: data_type.value).first ||
                     ResponseType.where(code: 'text').first
                 else
                   ResponseType.where(code: 'text').first
                 end
            question.response_type = rt
          end
          questions[q['OID']] = question
        end
        questions
      end

      def parse_document(file)
        doc = Nokogiri::XML(file)
        doc.root.add_namespace_definition('odm', 'http://www.cdisc.org/ns/odm/v1.3')
        doc.root.add_namespace_definition('ds', 'http://www.w3.org/2000/09/xmldsig#')
        doc.root.add_namespace_definition('xsi', 'http://www.w3.org/2001/XMLSchema-instance')
        doc.root.add_namespace_definition('redcap', 'https://projectredcap.org')
        doc
      end
    end
  end
end
