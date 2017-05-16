class ProgramSerializer < ActiveModel::Serializer
  attribute :id, key: :programId
  attribute :name, key: :programName
  attribute :description, key: :programDescription
  attribute :programUri do
    Rails.application.routes.url_helpers.api_program_url(object, only_path: true)
  end
end
