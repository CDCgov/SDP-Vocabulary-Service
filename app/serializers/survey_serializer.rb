class SurveySerializer < ActiveModel::Serializer
  attribute :programId do
    object.surveillance_program ? object.surveillance_program.id : nil
  end
  attribute :programName do
    object.surveillance_program ? object.surveillance_program.name : nil
  end
  attribute :programUri do
    if object.surveillance_program
      Rails.application.routes.url_helpers.api_program_url(object.surveillance_program, only_path: true)
    end
  end

  attribute :systemId do
    object.surveillance_system ? object.surveillance_system.id : nil
  end
  attribute :systemName do
    object.surveillance_system ? object.surveillance_system.name : nil
  end
  attribute :systemUri do
    if object.surveillance_system
      Rails.application.routes.url_helpers.api_system_url(object.surveillance_system, only_path: true)
    end
  end

  attribute :version_independent_id, key: :surveyId
  attribute :name, key: :surveyName
  attribute :surveyUri do
    Rails.application.routes.url_helpers.api_survey_url(object.version_independent_id, version: object.version, only_path: true)
  end
  attribute :version
  attribute :published_by, serializer: UserSerializer
  attribute :forms

  def forms
    object.survey_forms.includes(form: { form_questions: [:response_set, { question: :concepts }] }).collect do |sf|
      FormSerializer.new(sf.form)
    end
  end
end
