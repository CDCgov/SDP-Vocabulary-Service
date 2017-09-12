json.extract! @survey, :id, :name, :description, :created_at, :updated_at, :survey_forms, \
              :version_independent_id, :version, :all_versions, :most_recent, :concepts, \
              :control_number, :created_by_id, :status, :published_by, :parent
json.user_id @survey.created_by.email if @survey.created_by.present?
json.surveillance_system_id @survey.surveillance_system.id if @survey.surveillance_system.present?
json.surveillance_program_id @survey.surveillance_program.id if @survey.surveillance_program.present?
json.url survey_url(@survey, format: :json)
json.questions @survey.questions do |q|
  json.extract! q, :id, :content, :created_at, :created_by_id, :updated_at, :question_type_id, :description, :status, \
                :version, :version_independent_id, \
                :other_allowed
end

json.forms @survey.forms do |form|
  json.extract! form, :id, :name, :description, :created_at, :updated_at, \
                :version_independent_id, :version, :parent, \
                :form_questions, :control_number, :status, :created_by_id, :published_by_id
  json.url form_url(form, format: :json)
end
