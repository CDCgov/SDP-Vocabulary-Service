json.extract! question, :id, :content, :author, :created_at, :updated_at
json.url question_url(question, format: :json)