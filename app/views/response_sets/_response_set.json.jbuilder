json.extract! response_set, :id, :name, :description, :oid, :created_by, :responses, :coded, \
              :version, :all_versions, :other_versions, :most_recent, :questions, \
              :created_at, :updated_at, :parent
json.url response_set_url(response_set, format: :json)
