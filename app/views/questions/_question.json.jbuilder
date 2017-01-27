json.extract! question, :id, :content, :created_at, :created_by, :updated_at, :question_type_id, :concepts, \
              :question_type, :version, :all_versions, :other_versions, :most_recent, :response_sets, :response_type
json.url question_url(question, format: :json)
