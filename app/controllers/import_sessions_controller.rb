class ImportSessionsController < ApplicationController
  load_and_authorize_resource

  def create
    render status: :bad_request, json: { error: 'No spreadsheet present' } if params[:import_session][:spreadsheet].blank?
    spreadsheet_upload = params[:import_session][:spreadsheet]
    @import_session = ImportSession.new(spreadsheet: spreadsheet_upload.read,
                                        original_filename: spreadsheet_upload.original_filename, created_by: current_user)
    @import_session.check!

    render json: @import_session
  end

  def update
    if params[:import_session][:spreadsheet].present?
      spreadsheet_upload = params[:import_session][:spreadsheet]
      @import_session.spreadsheet = spreadsheet_upload.read
      @import_session.original_filename = spreadsheet_upload.original_filename
      @import_session.check!
    end
    @import_session.request_survey_creation = params[:import_session][:request_survey_creation]
    if @import_session.request_survey_creation && @import_session.top_level_sections > 0
      @import_session.create_survey!
    end
    render json: @import_session
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def import_session_params
    params.require(:import_session).permit(:spreadsheet, :request_survey_creation)
  end
end
