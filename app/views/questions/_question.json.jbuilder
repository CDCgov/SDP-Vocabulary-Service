json.extract! question, :id, :content, :created_at, :updated_at, :question_type_id
json.user_id question.created_by.email if question.created_by.present?
json.url question_url(question, format: :json)
