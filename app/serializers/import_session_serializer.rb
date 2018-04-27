class ImportSessionSerializer < ActiveModel::Serializer
  attributes :id, :import_errors, :import_warnings, :original_filename, :request_survey_creation, :top_level_sections, :survey, :sections

  def sections
    if object.survey_id
      surv = Survey.find(object.survey_id)
      surv.survey_sections.includes(section: { section_nested_items: [:response_set, { question: :concepts }, { nested_section: :concepts }] }).collect do |ss|
        SectionSerializer.new(ss.section)
      end
    else
      []
    end
  end
end
