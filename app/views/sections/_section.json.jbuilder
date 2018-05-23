json.extract! section, :id, :name, :description, :created_at, :updated_at, :concepts, \
              :version_independent_id, :version, :most_recent, :parent, \
              :section_nested_items, :status, :created_by_id, :published_by, :most_recent_published, \
              :groups, :nested_sections, :preferred
json.user_id section.created_by.email if section.created_by.present?
json.url section_url(section, format: :json)

json.all_versions section.all_versions do |s|
  json.extract! s, :id, :name, :created_by_id, :version_independent_id, :version, :groups, :status, :most_recent
end

json.versions section.paper_trail_versions do |version|
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

json.dupe_count section.q_with_dupes_count(current_user) if section && current_user

json.questions section.questions_with_most_recent do |q|
  json.extract! q, :id, :content, :created_at, :created_by_id, :updated_at, :category_id, :description, :status, \
                :version, :version_independent_id, :response_type, :most_recent, :most_recent_published, :subcategory_id, \
                :other_allowed, :groups
end

json.surveys section.surveys do |s|
  json.extract! s, :id, :name, :description, :created_at, :created_by_id, :updated_at, :most_recent, \
                :groups, :status, :version, :version_independent_id
end

json.response_sets section.response_sets.uniq do |rs|
  json.extract! rs, :id, :name, :description, :oid, \
                :status, :version, :version_independent_id, \
                :created_at, :updated_at, :published_by_id, :source
end
