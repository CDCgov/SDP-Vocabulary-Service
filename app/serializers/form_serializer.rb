class FormSerializer < ActiveModel::Serializer
  attribute :id, key: :formId
  attribute :name, key: :formName
  attribute :formUri
  def formUri
    Rails.application.routes.url_helpers.form_url(object)
  end
  has_many :questions, serializer: QuestionsSerializer
end
