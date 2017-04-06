class SurveySerializer < ActiveModel::Serializer
  attribute :surveillance_program_id, key: :programId
  def surveillance_program_id
    object.surveillance_program ? object.surveillance_program.id : nil
  end
  attribute :surveillance_program_name, key: :programName
  def surveillance_program_name
    object.surveillance_program ? object.surveillance_program.name : nil
  end
  attribute :surveillance_program_uri, key: :programUri
  def surveillance_program_uri
    if object.surveillance_program
      Rails.application.routes.url_helpers.api_program_url(object.surveillance_program, only_path: true)
    end
  end

  def surveillance_system_id
    object.surveillance_system ? object.surveillance_system.id : nil
  end
  attribute :surveillance_system_name, key: :systemName
  def surveillance_system_name
    object.surveillance_system ? object.surveillance_system.name : nil
  end
  attribute :surveillance_system_uri, key: :systemUri
  def surveillance_system_uri
    if object.surveillance_system
      Rails.application.routes.url_helpers.api_system_url(object.surveillance_system, only_path: true)
    end
  end

  attribute :version_independent_id, key: :surveyId
  attribute :name, key: :surveyName
  attribute :survey_uri, key: :surveyUri
  attribute :version
  def survey_uri
    Rails.application.routes.url_helpers.api_survey_url(object.version_independent_id, version: object.version, only_path: true)
  end
  has_many :forms, key: :questions, serializer: FormSerializer
end
