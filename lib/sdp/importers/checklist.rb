module SDP
  module Importers
    module Checklist
      def self.import(file, user)
        raw_xml = File.read(file)
        xml = Nokogiri::XML(raw_xml)
        # Removing XML namespaces is generally bad practice, but these
        # documents have nonsencical namespaces, so we get rid of them.
        xml.remove_namespaces!
        title = xml.children.at_xpath('template-header/title').text
        gh = xml.children.at_xpath('template-header/generic-header').text
        s = Survey.new(name: "#{title} - #{gh}", created_by: user)
        s.created_by = user
        process_sections(xml.children.xpath('template-body/header-group'), s, user)
        s.save!
      end

      def self.process_sections(section_nodes, survey, user)
        section_nodes.each_with_index do |sn, i|
          title = sn.at_xpath('title').text
          section = Section.new(name: title, created_by: user)
          ss = SurveySection.new(section: section, position: i)
          survey.survey_sections << ss
          process_questions(sn.xpath('header-group-items/question'), section, user)
          section.save!
        end
      end

      def self.process_questions(question_nodes, section, user)
        question_position = 0
        choice_response_type = ResponseType.where(name: 'Choice').first
        question_nodes.each do |qn|
          content = qn.at_xpath('title').text.strip
          content = qn['alt-text'] if content.blank?
          question = Question.new(content: content, created_by: user, response_type: choice_response_type)
          description = qn.at_xpath('fixed-list-answer/fixed-list-note')
          question.description = description.text.strip if description.present?
          rs = ResponseSet.new(name: "#{section.name} - #{question.content}", created_by: user)
          additional_questions = handle_items(qn, 'fixed-list-answer/fixed-list-item', rs, user)
          additional_questions = additional_questions.concat(handle_items(qn, 'fixed-list-answer/fixed-list-fillin-answer', rs, user))
          rs.save!
          question.response_sets << rs
          question.save!
          section.section_questions << SectionQuestion.new(question: question, position: question_position)
          question_position += 1
          additional_questions.each do |additional_question|
            section.section_questions << SectionQuestion.new(question: additional_question, position: question_position)
            question_position += 1
          end
        end
      end

      def self.handle_items(question_node, xpath_expression, rs, user)
        additional_questions = []
        question_node.xpath(xpath_expression).each do |item|
          sub_question = item.at_xpath('question')
          if sub_question
            additional_question = handle_subquestions(sub_question, item, rs, user)
            additional_questions << additional_question if additional_question
          else
            title = item['reportText']
            title = item.at_xpath('title').text if title.blank?
            r = Response.create(value: title)
            rs.responses << r
          end
        end
        additional_questions
      end

      def self.handle_subquestions(sub_node, parent_node, response_set, user)
        datatype = sub_node['datatype']
        title = parent_node.at_xpath('title').text
        if datatype.present? && sub_node.at_xpath('fixed-list-answer').blank?
          r = Response.create(value: title)
          response_set.responses << r
          sub_question_title = sub_node.at_xpath('title').text
          rt = ResponseType.where(name: datatype).first
          sub_q = Question.create(content: "#{title} - #{sub_question_title}",
                                  created_by: user, response_type: rt)
          return sub_q
        else
          sub_node.xpath('fixed-list-answer/fixed-list-item').each do |sub_response|
            sub_title = sub_response.at_xpath('title').text
            r = Response.create(value: "#{title} - #{sub_title}")
            response_set.responses << r
          end
          return nil
        end
      end
    end
  end
end
