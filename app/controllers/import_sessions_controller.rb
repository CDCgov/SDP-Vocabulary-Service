class ImportSessionsController < ApplicationController
  authorize_resource
  load_resource only: :update

  def create
    render status: :bad_request, json: { error: 'No spreadsheet present' } if import_session_params[:file].blank?
    spreadsheet_upload = import_session_params[:file]
    @import_type = import_session_params[:import_type]

    @import_session = ImportSession.new(spreadsheet: spreadsheet_upload.read,
                                        original_filename: spreadsheet_upload.original_filename, created_by: current_user)
    @import_session.check!(@import_type)

    render json: @import_session
  end

  def update
    if import_session_params[:file].present?
      spreadsheet_upload = import_session_params[:file]
      @import_session.spreadsheet = spreadsheet_upload.read
      @import_session.original_filename = spreadsheet_upload.original_filename
      @import_session.import_errors = []
      import_type = import_session_params[:import_type]
      @import_session.check!(import_type)
    end
    import_type = import_session_params[:import_type]

    @import_session.request_survey_creation = import_session_params[:request_survey_creation]
    if @import_session.request_survey_creation && @import_session.top_level_sections > 0
      @import_session.create_survey!(import_type)
    end
    render json: @import_session, status: :ok
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def import_session_params
    params.permit(:id, :request_survey_creation, :file, :import_type)
  end
end
