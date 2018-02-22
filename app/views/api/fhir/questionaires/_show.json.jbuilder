json.resourceType 'Questionnaire'
json.url api_fhir_questionaire_url(survey.version_independent_id)
json.status 'active'
json.id survey.version_independent_id.to_s
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
        if sni.nested_section
          json.partial! 'api/fhir/questionaires/nested_section', sni: sni
        else
          json.partial! 'api/fhir/questionaires/question', sni: sni
        end
      end
    end
  end
end
