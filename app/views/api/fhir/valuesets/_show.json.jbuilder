json.resourceType 'ValueSet'
json.id value_set.id.to_s
json.url api_fhir_valueset_version_url(value_set.version_independent_id, value_set.version)
if value_set.oid
  json.identifier	do
    json.child! do
      json.system 'urn:ietf:rfc:3986'
      json.value 'urn:oid:' + value_set.oid
    end
  end
end
json.version value_set.version.to_s
json.name value_set.name
json.status 'active' # value_set.status
json.date value_set.updated_at
json.publisher value_set.source
json.description value_set.description
json.expansion do
  json.identifier "urn:uuid:#{SecureRandom.uuid}"
  json.timestamp  Time.now
  json.total value_set.responses.count
  json.offset @offset || 0
  json.contains do
    json.array! value_set.responses.offset(@offset || 0).limit(@limit || 100) do |code|
      json.system "urn:oid:#{code.code_system}"
      json.code code.value
      json.display code.display_name
    end
  end
end
