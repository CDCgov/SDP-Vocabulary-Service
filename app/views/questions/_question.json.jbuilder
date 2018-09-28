json.extract! question, :id, :content, :created_at, :created_by, :created_by_id, :updated_at, :category_id, :concepts, :description, :status, \
              :category, :version, :version_independent_id, :other_versions, :most_recent, :response_sets, :response_type, :data_collection_methods, \
              :parent, :other_allowed, :published_by, :most_recent_published, :subcategory, :groups, :linked_response_sets, :preferred, :content_stage, \
              :duplicate_of
json.url question_url(question, format: :json)

json.sections question.sections do |s|
  json.extract! s, :id, :name, :description, :created_at, :updated_at, \
                :version_independent_id, :version, :most_recent, :most_recent_published, \
                :section_nested_items, :status, :content_stage, :created_by_id, :groups
end

json.all_versions question.all_versions do |q|
  json.extract! q, :id, :content, :created_by_id, :version_independent_id, :version, :groups, :status, :content_stage, :most_recent
end

json.versions question.paper_trail_versions do |version|
  json.extract! version, :created_at, :comment, :associations
  json.tags JSON.parse(version.associations['tags'].gsub('=>', ':')) if version.associations['tags']
  json.response_sets JSON.parse(version.associations['response sets'].gsub('=>', ':')) if version.associations['response sets']
  json.author User.find(version.whodunnit).email if version.whodunnit
  temp_hash = {}
  version.changeset.each_pair do |field, arr|
    if field.end_with?('_id')
      before_name = field.chomp('_id').camelize.constantize.find(arr[0]).name if arr[0]
      after_name = field.chomp('_id').camelize.constantize.find(arr[1]).name if arr[1]
      temp_hash[field.chomp('_id').humanize] = [before_name, after_name]
    elsif field == 'minor_change_count'
      next
    else
      temp_hash[field.humanize] = arr
    end
  end
  json.changeset temp_hash
end
