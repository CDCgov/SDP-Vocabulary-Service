json.extract! section, :id, :name, :description, :created_at, :updated_at, :concepts, \
              :version_independent_id, :version, :most_recent, :parent, \
              :section_nested_items, :status, :created_by_id, :published_by, :most_recent_published, \
              :groups, :nested_sections
json.user_id section.created_by.email if section.created_by.present?
json.url section_url(section, format: :json)

json.all_versions section.all_versions do |s|
  json.extract! s, :id, :name, :created_by_id, :version_independent_id, :version, :groups, :status, :most_recent
end

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
