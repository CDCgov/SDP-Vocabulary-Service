class ImportSessionSerializer < ActiveModel::Serializer
  attributes :id, :import_errors, :original_filename, :request_survey_creation, :top_level_sections
end
