json.extract! question, :id, :content, :created_at, :created_by, :created_by_id, :updated_at, :category_id, :concepts, :description, :status, \
              :category, :version, :version_independent_id, :other_versions, :most_recent, :response_sets, :response_type, \
              :parent, :other_allowed, :published_by, :most_recent_published, :subcategory, :groups, :linked_response_sets
json.url question_url(question, format: :json)

json.sections question.sections do |s|
  json.extract! s, :id, :name, :description, :created_at, :updated_at, \
                :version_independent_id, :version, :most_recent, :most_recent_published, \
                :section_nested_items, :status, :created_by_id, :groups
end

json.all_versions question.all_versions do |q|
  json.extract! q, :id, :content, :created_by_id, :version_independent_id, :version, :groups, :status, :most_recent
end

json.versions question.paper_trail_versions do |version|
  json.extract! version, :changeset, :created_at
  json.author User.find(version.whodunnit).email
end
