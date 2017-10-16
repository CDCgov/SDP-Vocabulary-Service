
json.resourceType 'ValueSet'
json.id @response_set.id
json.url	json.url api_fhir_valueset_url(@response_set)
json.identifier	do
  json.system 'urn:ietf:rfc:3986'
  json.value 'urn:oid:' + @response_set.oid
end
json.version	@response_set.version
json.name	@response_set.name
json.status	@response_set.status
json.date	@response_set.updated_at
json.publisher @response_set.source
json.description	@response_set.description
json.expansion do
  json.identifier nil
  json.timestamp  nil
  json.total @response_set.responses.count
  json.offset 0
  json.contains do
    json.array! @response_set.responses do |code|
      json.system code.code_system
      json.code code.value
      json.display code.display_name
    end
  end
end
