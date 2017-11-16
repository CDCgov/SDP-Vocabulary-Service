if codes && !codes.empty?
  json.meta do
    json.tag do
      json.array! codes do |code|
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
