class ProgramSerializer < ActiveModel::Serializer
  attribute :id, key: :programId
  attribute :name, key: :programName
  attribute :description, key: :programDescription
  attribute :program_uri, key: :programUri
  def program_uri
    Rails.application.routes.url_helpers.api_program_url(object, only_path: true)
  end
  # has_many :forms, serializer: FormSerializer
end
