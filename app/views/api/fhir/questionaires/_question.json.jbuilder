json.linkId link_id(sni.question)
json.text sni.question.content if sni.question
type = sni.question.response_type.code if sni.question
type ||= sni.response_set ? 'choice' : 'text'
json.type type
json.extension do
  if sni.question.concepts && !sni.question.concepts.empty?
    json.child! do
      json.partial! 'api/fhir/extension_tags', codes: sni.question.concepts
    end
  end
  if sni.program_var.present?
    json.child! do
      json.url 'https://sdp-v.services.cdc.gov/fhir/questionnaire-item-program-var'
      json.valueString sni.program_var
    end
  end
end
if sni.response_set
  json.options do
    json.reference api_fhir_valueset_version_url(sni.response_set.version_independent_id, sni.response_set.version)
  end
end
