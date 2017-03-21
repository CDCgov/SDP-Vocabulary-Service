json.extract! survey, :id, :name, :created_at, :updated_at, :survey_forms, \
              :version_independent_id, :version, :all_versions, :most_recent, \
              :control_number, :created_by_id
json.user_id survey.created_by.email if survey.created_by.present?
json.url survey_url(survey, format: :json)
