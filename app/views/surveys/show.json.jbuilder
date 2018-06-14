json.extract! @survey, :id, :name, :description, :created_at, :updated_at, :survey_sections, \
              :version_independent_id, :version, :most_recent, :most_recent_published, :concepts, \
              :control_number, :omb_approval_date, :created_by_id, :status, :published_by, :parent, :groups, :preferred
json.user_id @survey.created_by.email if @survey.created_by.present?
json.surveillance_system_id @survey.surveillance_system.id if @survey.surveillance_system.present?
json.surveillance_program_id @survey.surveillance_program.id if @survey.surveillance_program.present?
json.url survey_url(@survey, format: :json)
json.questions @survey.questions do |q|
  json.extract! q, :id, :content, :created_at, :created_by_id, :updated_at, :category_id, :description, :status, \
                :version, :version_independent_id, :subcategory_id, \
                :other_allowed
end

json.all_versions @survey.all_versions do |s|
  json.extract! s, :id, :name, :created_by_id, :version_independent_id, :version, :groups, :status, :most_recent
end

json.versions @survey.paper_trail_versions do |version|
  json.extract! version, :created_at, :comment
  json.author User.find(version.whodunnit).email if version.whodunnit
  temp_hash = {}
  version.changeset.each_pair do |field, arr|
    if field.end_with?('_id')
      before_name = field.chomp('_id').camelize.constantize.find(arr[0]).name if arr[0]
      after_name = field.chomp('_id').camelize.constantize.find(arr[1]).name if arr[1]
      temp_hash[field.chomp('_id').humanize] = [before_name, after_name]
    else
      temp_hash[field.humanize] = arr
    end
  end
  json.changeset temp_hash
end

json.dupe_count @survey.q_with_dupes_count(current_user) if @survey && current_user

json.nested_sections @survey.nested_sections do |section|
  json.extract! section, :id, :name, :description, :created_at, :updated_at, \
                :version_independent_id, :version, :parent, :most_recent, :most_recent_published, \
                :section_nested_items, :status, :created_by_id, :published_by_id
  json.url section_url(section, format: :json)
end

json.sections @survey.sections_with_most_recent do |section|
  json.extract! section, :id, :name, :description, :created_at, :updated_at, \
                :version_independent_id, :version, :parent, :most_recent, :most_recent_published, \
                :section_nested_items, :status, :created_by_id, :published_by_id, :groups
  json.url section_url(section, format: :json)
end
