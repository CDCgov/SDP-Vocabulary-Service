require 'test_helper'
require 'sdp/importers/spreadsheet'

class MMGTest < ActiveSupport::TestCase
  SURVEY_COUNT = 1
  FORM_COUNT = 3
  QUESTION_COUNT = 4
  RESPONSE_SET_COUNT = 2
  RESPONSE_COUNT = 6

  test 'parse_mmg' do
    u = users(:admin)
    f = './test/fixtures/files/TestMMG.xlsx'

    importer = SDP::Importers::Spreadsheet.new(f, u)
    importer.parse!

    rscount = ResponseSet.count
    rcount = Response.count
    qcount = Question.count
    formcount = Form.count
    surveycount = Survey.count

    importer.save!

    assert_equal rcount + RESPONSE_COUNT, Response.count
    assert_equal rscount + RESPONSE_SET_COUNT, ResponseSet.count
    assert_equal qcount  + QUESTION_COUNT, Question.count
    assert_equal formcount + FORM_COUNT, Form.count
    assert_equal surveycount + SURVEY_COUNT, Survey.count

    assert Survey.where(name: f).exists?

    form = Form.where(name: 'Imported Form #1').first
    assert form.present?
    assert_equal form.questions.count, 1
    assert_equal form.concepts.count, 1
    assert_equal form.form_questions.first.position, 0
    assert_equal form.concepts.first.value, 'Data Elements'

    survey = Survey.where(name: f).first
    assert survey.forms.count, FORM_COUNT
    assert survey.survey_forms.first.position, 0
  end
end
