json.extract! form, :id, :name, :description, :created_at, :updated_at, :questions, \
              :version_independent_id, :version, :all_versions, :most_recent, \
              :form_questions, :control_number, :created_by_id
json.user_id form.created_by.email if form.created_by.present?
json.url form_url(form, format: :json)
