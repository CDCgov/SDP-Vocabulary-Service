json.array! @forms do |form|
  json.extract! form, :id, :name, :description, :created_at, :updated_at, \
                :version_independent_id, :version, :parent, :concepts, \
                :form_questions, :control_number, :status, :created_by_id, :published_by_id
  json.url form_url(form, format: :json)

  json.questions form.questions do |q|
    json.extract! q, :id, :content, :created_at, :created_by_id, :updated_at, :question_type_id, :description, :status, \
                  :version, :version_independent_id, \
                  :other_allowed
  end
end
