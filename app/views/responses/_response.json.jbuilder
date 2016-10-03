json.extract! response, :id, :value, :response_set_id, :created_at, :updated_at
json.url response_url(response, format: :json)
