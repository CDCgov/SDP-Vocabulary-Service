require 'test_helper'

class ImportSessionsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @current_user = users(:admin)
    sign_in @current_user
  end

  test 'create an import session' do
    post import_sessions_url(format: :json), params: { file: fixture_file_upload('./test/fixtures/files/TestMMG.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', :binary) }
    assert_response :success
    response_json = JSON.parse(@response.body)
    assert_equal 6, response_json['top_level_sections']
  end

  test 'create an import session with a non-Excel file' do
    post import_sessions_url(format: :json), params: { file: fixture_file_upload('./test/fixtures/files/jupiter_response.json', 'application/json', :binary) }
    assert_response :success
    response_json = JSON.parse(@response.body)
    assert_equal 'The file does not appear to be an Excel spreadsheet', response_json['import_errors'][0]
  end

  test 'create an import session and create survey' do
    post import_sessions_url(format: :json), params: { file: fixture_file_upload('./test/fixtures/files/TestMMG.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', :binary) }
    assert_response :success
    response_json = JSON.parse(@response.body)
    is_id = response_json['id']
    assert_difference 'Survey.count' do
      put import_session_url(is_id), params: { request_survey_creation: true }
    end
    import_session = ImportSession.find is_id
    survey = Survey.last
    assert_equal import_session.survey_id, survey.id
    assert_equal 6, survey.sections.count
  end
end
