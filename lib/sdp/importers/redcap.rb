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
        forms = parse_forms(item_groups)
        forms
      end

      def parse_forms(item_groups)
        forms = {}
        xml.xpath('//odm:FormDef').each do |f|
          form = Form.new(name: f['Name'],
                          created_by: user)
          forms[f['OID']] = form
          f.xpath('./odm:ItemGroupRef').each do |igr|
            ig_questions = item_groups[igr['ItemGroupOID']]
            ig_questions.each do |q|
              form.form_questions << FormQuestion.new(question: q, response_set: q.response_sets[0])
            end
          end
        end
        forms
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
          questions[q['OID']] = question
          clr = q.at_xpath('./odm:CodeListRef')
          question.response_sets << response_sets[clr['CodeListOID']] if clr
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
