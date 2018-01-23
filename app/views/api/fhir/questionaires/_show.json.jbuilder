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
  json.array! survey.sections do |form|
    json.linkId form.id.to_s
    json.text form.name
    json.type 'group'
    json.extension do
      if form.concepts && !form.concepts.empty?
        json.child! do
          json.partial! 'api/fhir/extension_tags', codes: form.concepts
        end
      end
    end
    json.item do
      json.array! form.section_questions.each do |sq|
        json.linkId sq.id.to_s
        json.text sq.question.content
        type = sq.question.response_type.code
        type ||= sq.response_set ? 'choice' : 'text'
        json.type type
        json.extension do
          if sq.question.concepts && !sq.question.concepts.empty?
            json.child! do
              json.partial! 'api/fhir/extension_tags', codes: sq.question.concepts
            end
          end
          if sq.program_var.present?
            json.child! do
              json.url 'https://sdp-v.services.cdc.gov/fhir/questionnaire-item-program-var'
              json.valueString sq.program_var
            end
          end
        end
        if sq.response_set
          json.options do
            json.reference api_fhir_valueset_version_url(sq.response_set.version_independent_id, sq.response_set.version)
          end
        end
      end
    end
  end
end
