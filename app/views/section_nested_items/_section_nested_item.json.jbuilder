json.extract! section_nested_item, :id, :section_id, :question_id, :response_set_id, :nested_section_id, \
              :created_at, :updated_at, :position, :program_var
json.url section_nested_item_url(section_nested_item, format: :json)
