json.extract! response_type, :id, :name, :created_at, :updated_at
json.url response_type_url(response_type, format: :json)
