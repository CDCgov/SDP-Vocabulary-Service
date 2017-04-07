class SystemSerializer < ActiveModel::Serializer
  attribute :id, key: :systemId
  attribute :name, key: :systemName
  attribute :description, key: :systemDescription
  attribute :program_uri, key: :systemUri
  def program_uri
    Rails.application.routes.url_helpers.api_system_url(object, only_path: true)
  end
end
