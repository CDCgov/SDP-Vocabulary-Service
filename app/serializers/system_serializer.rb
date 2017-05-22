class SystemSerializer < ActiveModel::Serializer
  attribute :id, key: :systemId
  attribute :name, key: :systemName
  attribute :description, key: :systemDescription
  attribute :systemUri do
    Rails.application.routes.url_helpers.api_system_url(object, only_path: true)
  end
end
