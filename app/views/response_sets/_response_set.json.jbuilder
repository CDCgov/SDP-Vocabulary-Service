json.extract! response_set, :id, :name, :description, :oid, :author, :code, :code_system, :created_at, :updated_at
json.url response_set_url(response_set, format: :json)
