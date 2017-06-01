json.extract! form, :id, :name, :description, :created_at, :updated_at, \
              :version_independent_id, :version, :all_versions, :most_recent, :parent, \
              :form_questions, :control_number, :status, :created_by_id, :published_by
json.user_id form.created_by.email if form.created_by.present?
json.url form_url(form, format: :json)

json.questions form.questions do |q|
  json.extract! q, :id, :content, :created_at, :created_by_id, :updated_at, :question_type_id, :description, :status, \
                :version, :version_independent_id, \
                :other_allowed
end

json.response_sets form.response_sets.uniq do |rs|
  json.extract! rs, :id, :name, :description, :oid, \
                :status, :version, :version_independent_id, \
                :created_at, :updated_at, :published_by_id, :source
end
