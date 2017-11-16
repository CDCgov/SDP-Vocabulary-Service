json.resourceType 'Questionnaire'
json.url api_fhir_questionaire_url(section)
json.status	'active' # section.status
json.version section.version.to_s
json.name section.name.to_s
json.title section.name.to_s
json.date section.updated_at
json.description section.description.to_s
json.partial! 'api/fhir/codes', codes: section.concepts
json.item do
  json.array! section.section_questions.each do |sq|
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
    end
    if sq.response_set
      json.options do
        json.reference api_fhir_valueset_version_url(sq.response_set.version_independent_id, sq.response_set.version)
      end
    end
  end
end
