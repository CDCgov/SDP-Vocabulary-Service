
json.resourceType 'ValueSet'
json.id @response_set.id
json.url	json.url api_fhir_valueset_url(@response_set)
if @response_set.oid
  json.identifier	do
    json.system 'urn:ietf:rfc:3986'
    json.value 'urn:oid:' + @response_set.oid
  end
end
json.version	@response_set.version
json.name	@response_set.name
json.status	@response_set.status
json.date	@response_set.updated_at
json.publisher @response_set.source
json.description	@response_set.description
json.partial! 'api/fhir/codes', codes: @response_set.concepts
json.expansion do
  json.identifier nil
  json.timestamp  nil
  json.total @response_set.responses.count
  json.offset 0
  json.contains do
    json.array! @response_set.responses do |code|
      json.system "urn:oid:#{code.code_system}"
      json.code code.value
      json.display code.display_name
    end
  end
end
