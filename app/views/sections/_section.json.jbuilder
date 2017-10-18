json.extract! section, :id, :name, :description, :created_at, :updated_at, :concepts, \
              :version_independent_id, :version, :all_versions, :most_recent, :parent, \
              :section_questions, :status, :created_by_id, :published_by
json.user_id section.created_by.email if section.created_by.present?
json.url section_url(section, format: :json)

json.questions section.questions_with_most_recent do |q|
  json.extract! q, :id, :content, :created_at, :created_by_id, :updated_at, :question_type_id, :description, :status, \
                :version, :version_independent_id, :response_type, :most_recent, \
                :other_allowed
end

json.response_sets section.response_sets.uniq do |rs|
  json.extract! rs, :id, :name, :description, :oid, \
                :status, :version, :version_independent_id, \
                :created_at, :updated_at, :published_by_id, :source
end
