json.extract! response_set, :id, :name, :description, :oid, :created_by, :created_by_id, \
              :status, :version, :most_recent, :most_recent_published, :version_independent_id, :content_stage, \
              :questions, :created_at, :updated_at, :parent, :published_by, :source, :groups, :preferred, :duplicate_of
json.url response_set_url(response_set, format: :json)

json.all_versions response_set.all_versions do |rs|
  json.extract! rs, :id, :name, :created_by_id, :version_independent_id, :version, :groups, :status, :content_stage, :most_recent
end

rs_count = response_set.responses.count
if rs_count <= 25 || is_edit
  json.responses response_set.responses
else
  json.responses response_set.responses.first(25)
end
json.response_count rs_count if rs_count > 25

json.versions response_set.paper_trail_versions do |version|
  json.extract! version, :created_at, :comment, :associations
  json.responses JSON.parse(version.associations['responses'].gsub('=>', ':')) if version.associations['responses']
  json.author User.find(version.whodunnit).email if version.whodunnit
  temp_hash = {}
  version.changeset.each_pair do |field, arr|
    if field.end_with?('_id')
      before_name = field.chomp('_id').camelize.constantize.find(arr[0]).name if arr[0]
      after_name = field.chomp('_id').camelize.constantize.find(arr[1]).name if arr[1]
      temp_hash[field.chomp('_id').humanize] = [before_name, after_name]
    elsif field == 'minor_change_count'
      next
    else
      temp_hash[field.humanize] = arr
    end
  end
  json.changeset temp_hash
end
