json.extract! response_set, :id, :name, :description, :oid, :created_by, :created_by_id, :responses, :coded, \
              :status, :version, :all_versions, :most_recent, :version_independent_id, \
              :questions, :created_at, :updated_at, :parent
json.url response_set_url(response_set, format: :json)
