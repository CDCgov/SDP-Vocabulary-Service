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
  attribute :sections
  # To ensure backwards compatibility in release 1.12 tags logic is still
  # a combination of both single word tags and code mappings
  attribute(:tags) { codes }
  attribute :tag_list, key: :singleWordTags
  attribute :codeSystemMappings do
    object.concepts.collect { |c| CodeSerializer.new(c).as_json }
  end

  def codes
    object.concepts.collect { |c| CodeSerializer.new(c).as_json } + object.tag_list.map { |tag| {'displayName': tag, 'code': '', 'codeSystem': ''}}
  end

  def sections
    object.survey_sections.includes(section: { section_nested_items: [:response_set, { question: :concepts }, { nested_section: :concepts }] }).collect do |ss|
      SectionSerializer.new(ss.section)
    end
  end
end
