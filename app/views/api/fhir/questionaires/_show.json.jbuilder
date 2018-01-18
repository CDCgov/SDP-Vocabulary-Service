json.resourceType 'Questionnaire'
json.url api_fhir_questionaire_url(survey.version_independent_id)
json.status 'active'
json.version survey.version.to_s
json.name survey.name.to_s
json.title survey.name.to_s
json.date survey.updated_at
json.description survey.description || ''
json.partial! 'api/fhir/codes', codes: survey.concepts
json.item do
  json.array! survey.sections do |section|
    json.linkId section.id.to_s
    json.text section.name
    json.type 'group'
    json.extension do
      if section.concepts && !section.concepts.empty?
        json.child! do
          json.partial! 'api/fhir/extension_tags', codes: section.concepts
        end
      end
    end
    json.item do
      json.array! section.section_nested_items.each do |sni|
        json.linkId sni.id.to_s
        json.text sni.question.content if sni.question
        json.text sni.nested_section.name if sni.nested_section
        type = sni.question.response_type.code if sni.question
        type ||= sni.response_set ? 'choice' : 'text'
        json.type type
        json.extension do
          if sni.question && sni.question.concepts && !sni.question.concepts.empty?
            json.child! do
              json.partial! 'api/fhir/extension_tags', codes: sni.question.concepts
            end
          elsif sni.nested_section && sni.nested_section.concepts && !sni.nested_section.concepts.empty?
            json.child! do
              json.partial! 'api/fhir/extension_tags', codes: sni.nested_section.concepts
            end
          end
        end
        if sni.response_set
          json.options do
            json.reference api_fhir_valueset_version_url(sni.response_set.version_independent_id, sni.response_set.version)
          end
        end
      end
    end
  end
end
