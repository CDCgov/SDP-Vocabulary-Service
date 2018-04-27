require 'test_helper'

class ImportSessionTest < ActiveSupport::TestCase
  setup do
    @user = users(:admin)
    @import_session = ImportSession.new(spreadsheet: File.read('./test/fixtures/files/TestMMG.xlsx', mode: 'rb'),
                                        created_by: @user, original_filename: 'TestMMG.xlsx')
  end

  test 'check!' do
    assert_difference 'ImportSession.count' do
      @import_session.check!
      assert_equal "Value set tab 'Yes No Unknown (YNU)' not present", @import_session.import_errors.first
      assert_equal 6, @import_session.top_level_sections
    end
  end

  test 'check! with non-Excel file' do
    assert_difference 'ImportSession.count' do
      import_session = ImportSession.new(spreadsheet: File.read('./test/fixtures/files/jupiter_response.json', mode: 'rb'),
                                         created_by: @user, original_filename: 'jupiter_response.json')
      import_session.check!
      assert_equal 'The file does not appear to be an Excel spreadsheet', import_session.import_errors.first
      assert_nil import_session.top_level_sections
    end
  end

  test 'check! with non-MMG Excel file' do
    assert_difference 'ImportSession.count' do
      import_session = ImportSession.new(spreadsheet: File.read('./test/fixtures/files/TestGenericTemplate.xlsx', mode: 'rb'),
                                         created_by: @user, original_filename: 'TestGenericTemplate.xlsx')
      import_session.check!
      assert_equal "Unable to find any data element sheets in this Excel file. Check that your spreadsheet sections are separated by 'START: ' and 'END: ' rows (include these phrases with exact spelling before the section name).", import_session.import_errors.first
    end
  end

  test 'create_survey!' do
    @import_session.check!
    @import_session.reload
    assert_difference 'Survey.count' do
      @import_session.create_survey!
    end
    assert @import_session.survey
    assert_equal 6, @import_session.survey.sections.count
  end
end
