json.array! @surveys do |survey|
  json.extract! survey, :id, :name, :description, :created_at, :updated_at, :survey_forms, \
                :version_independent_id, :version, :all_versions, :most_recent, \
                :control_number, :created_by_id, :status, :published_by, :parent
  json.user_id survey.created_by.email if survey.created_by.present?
  json.surveillance_system_id survey.surveillance_system.id if survey.surveillance_system.present?
  json.surveillance_program_id survey.surveillance_program.id if survey.surveillance_program.present?
  json.url survey_url(survey, format: :json)
end
