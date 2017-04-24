json.extract! question, :id, :content, :created_at, :created_by, :created_by_id, :updated_at, :question_type_id, :concepts, :description, :status, \
              :question_type, :version, :all_versions, :version_independent_id, :other_versions, :most_recent, :response_sets, :response_type, \
              :parent, :other_allowed, :published_by
json.url question_url(question, format: :json)
