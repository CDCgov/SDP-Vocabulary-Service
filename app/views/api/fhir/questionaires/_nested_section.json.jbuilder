json.linkId sni.id.to_s
json.text sni.nested_section.name
json.type 'group'
json.item do
  json.array! sni.nested_section.section_nested_items.each do |sni|
    if sni.nested_section
      json.partial! 'api/fhir/questionaires/nested_section', sni: sni
    else
      json.partial! 'api/fhir/questionaires/question', sni: sni
    end
  end
end
json.extension do
  if sni.nested_section.concepts && !sni.nested_section.concepts.empty?
    json.child! do
      json.partial! 'api/fhir/extension_tags', codes: sni.nested_section.concepts
    end
  end
  if sni.program_var.present?
    json.child! do
      json.url 'https://sdp-v.services.cdc.gov/fhir/questionnaire-item-program-var'
      json.valueString sni.program_var
    end
  end
end
