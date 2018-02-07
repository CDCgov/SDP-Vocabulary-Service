json.extract! response_set, :id, :name, :description, :oid, :created_by, :created_by_id, :responses, \
              :status, :version, :most_recent, :most_recent_published, :version_independent_id, \
              :questions, :created_at, :updated_at, :parent, :published_by, :source, :groups
json.url response_set_url(response_set, format: :json)

json.all_versions response_set.all_versions do |rs|
  json.extract! rs, :id, :name, :created_by_id, :version_independent_id, :version, :groups, :status, :most_recent
end
