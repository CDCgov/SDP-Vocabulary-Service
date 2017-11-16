json.resourceType 'Questionnaire'
json.url api_fhir_questionaire_url(survey.version_independent_id)
json.status	'active'
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
    json.uri api_fhir_section_version_url(form.version_independent_id, form.version)
    json.type 'group'
    json.extension do
      if form.concepts && !form.concepts.empty?
        json.child! do
          json.partial! 'api/fhir/extension_tags', codes: form.concepts
        end
      end
    end
    json.item do
      json.array! form.section_questions.each do |fq|
        json.linkId fq.id.to_s
        json.text fq.question.content
        type = fq.question.response_type.code
        type ||= fq.response_set ? 'choice' : 'text'
        json.type type
        json.extension do
          if fq.question.concepts && !fq.question.concepts.empty?
            json.child! do
              json.partial! 'api/fhir/extension_tags', codes: fq.question.concepts
            end
          end
        end
        if fq.response_set
          json.options do
            json.reference api_fhir_valueset_version_url(fq.response_set.version_independent_id, fq.response_set.version)
          end
        end
      end
    end
  end
end
