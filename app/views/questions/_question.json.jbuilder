json.extract! question, :id, :content, :author, :created_at, :updated_at, :question_type_id
json.url question_url(question, format: :json)
