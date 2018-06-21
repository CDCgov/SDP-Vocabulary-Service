module Api
  module Fhir
    module QuestionairesHelper
      def link_id(question)
        de_id = question.concepts.find { |c| c.display_name == 'Data Element Identifier' } if question.concepts.present?
        if de_id
          de_id.value
        else
          question.id.to_s
        end
      end
    end
  end
end
