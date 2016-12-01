class FormSerializer < ActiveModel::Serializer
  attribute :id, key: :formId
  attribute :name, key: :formName
  attribute :form_uri, key: :formUri
  def form_uri
    Rails.application.routes.url_helpers.api_form_url(object, only_path: true)
  end
  has_many :questions, serializer: QuestionsSerializer
end
