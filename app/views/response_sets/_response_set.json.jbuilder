json.extract! response_set, :id, :name, :description, :oid, :created_by, :created_by_id, :responses, \
              :status, :version, :most_recent, :most_recent_published, :version_independent_id, \
              :questions, :created_at, :updated_at, :parent, :published_by, :source, :groups, :preferred
json.url response_set_url(response_set, format: :json)

json.all_versions response_set.all_versions do |rs|
  json.extract! rs, :id, :name, :created_by_id, :version_independent_id, :version, :groups, :status, :most_recent
end

json.versions response_set.paper_trail_versions do |version|
  json.extract! version, :created_at, :comment
  json.author User.find(version.whodunnit).email if version.whodunnit
  temp_hash = {}
  version.changeset.each_pair do |field, arr|
    if field.end_with?('_id')
      before_name = field.chomp('_id').camelize.constantize.find(arr[0]).name if arr[0]
      after_name = field.chomp('_id').camelize.constantize.find(arr[1]).name if arr[1]
      temp_hash[field.chomp('_id').humanize] = [before_name, after_name]
    else
      temp_hash[field.humanize] = arr
    end
  end
  json.changeset temp_hash
end
