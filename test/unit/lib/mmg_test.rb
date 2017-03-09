require 'test_helper'
require 'sdp/importers/spreadsheet'

class MMGTest < ActiveSupport::TestCase
  FORM_COUNT = 1
  QUESTION_COUNT = 3
  RESPONSE_SET_COUNT = 2
  RESPONSE_COUNT = 6
  SECTION_COUNT = 0

  test 'parse_mmg' do
    u = users(:admin)
    f = './test/fixtures/files/TestMMG.xlsx'

    importer = SDP::Importers::Spreadsheet.new(f, u)
    importer.parse!

    rscount = ResponseSet.count
    rcount = Response.count
    qcount = Question.count
    formcount = Form.count

    importer.save!

    assert_equal rcount + RESPONSE_COUNT, Response.count
    assert_equal rscount + RESPONSE_SET_COUNT, ResponseSet.count
    assert_equal qcount  + QUESTION_COUNT, Question.count
    assert_equal formcount + FORM_COUNT, Form.count
  end
end
