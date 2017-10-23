json.extension do
  json.array! [1] do
    json.url ''
    json.valueCodeableConcept do
      json.array! @codes do |code|
        json.code code.value
        json.display code.display_name
        if code.code_system
          json.system 'urn:oid:' + code.code_system
        elsif code.code_system
          json.system code.code_system
        end
      end
    end
  end
end
