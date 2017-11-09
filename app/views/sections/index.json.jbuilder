json.array! @sections do |section|
  json.extract! section, :id, :name, :description, :created_at, :updated_at, \
                :version_independent_id, :version, :parent, :concepts, \
                :section_questions, :status, :created_by_id, :published_by_id
  json.url section_url(section, format: :json)

  json.questions section.questions do |q|
    json.extract! q, :id, :content, :created_at, :created_by_id, :updated_at, :category_id, :description, :status, \
                  :version, :version_independent_id, :subcategory_id, \
                  :other_allowed
  end
end
