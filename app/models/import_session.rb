require './lib/sdp/importers/spreadsheet'

class ImportSession < ApplicationRecord
  belongs_to :survey
  belongs_to :created_by, class_name: 'User'

  def check!
    begin
      importer = SDP::Importers::Spreadsheet.new(roo_friendly_spreadsheet, created_by)
      importer.parse!
      self.top_level_sections = importer.top_level_section_count
      self.import_errors = importer.errors.uniq if importer.errors.present?
      unless importer.sections_exist?
        self.import_errors ||= []
        self.import_errors << 'Unable to find any data element sheets in this Excel file'
      end
    rescue ArgumentError, Zip::Error
      self.import_errors ||= []
      self.import_errors << 'The file does not appear to be an Excel spreadsheet'
    end
    save!
  end

  def create_survey!
    importer = SDP::Importers::Spreadsheet.new(roo_friendly_spreadsheet, created_by, survey_name: original_filename)
    importer.parse!
    if importer.sections_exist?
      survey = importer.save!
      self.survey = survey
    else
      self.import_errors ||= []
      self.import_errors << 'Unable to find any data element sheets in this Excel file'
    end
    save!
  end

  private

  def roo_friendly_spreadsheet
    StringIO.new(spreadsheet)
  end
end
