json.array! @questions do |question|
  json.extract! question, :id, :content, :created_at, :created_by_id, :updated_at, :question_type_id, :description, :status, \
                :question_type, :subcategory, :version, :version_independent_id, :response_type, \
                :parent, :other_allowed
  json.url question_url(question, format: :json)
  json.response_sets question.response_sets do |rs|
    json.extract! rs, :id, :name, :description, :oid, :created_by_id, \
                  :status, :version, :version_independent_id, \
                  :created_at, :updated_at, :source
  end
end
