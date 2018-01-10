require 'test_helper'
require 'sdp/importers/spreadsheet'

class MMGTest < ActiveSupport::TestCase
  SURVEY_COUNT = 1
  SECTION_COUNT = 3
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
    sectioncount = Section.count
    surveycount = Survey.count

    importer.save!

    assert_equal rcount + RESPONSE_COUNT, Response.count
    assert_equal rscount + RESPONSE_SET_COUNT, ResponseSet.count
    assert_equal qcount  + (QUESTION_COUNT * 2), Question.count
    assert_equal sectioncount + (SECTION_COUNT * 2), Section.count
    assert_equal surveycount + SURVEY_COUNT, Survey.count

    assert Survey.where(name: f).exists?

    section = Section.where(name: 'Data Elements').first
    assert section.present?
    assert_equal section.questions.count, 1
    assert_equal section.concepts.count, 1
    assert_equal section.section_questions.first.position, 0
    assert_equal section.concepts.first.value, 'Data Elements'
    section = Section.where(name: 'Form Completion Metadata').first
    assert section.present?
    assert_equal section.questions.first.concepts.first.value, 'INV920'
    assert_equal section.questions.first.concepts.first.display_name, 'Data Element Identifier'

    survey = Survey.where(name: f).first
    assert survey.sections.count, SECTION_COUNT
    assert survey.survey_sections.first.position, 0
  end

  test 'extend import' do
    u = users(:admin)
    f = './test/fixtures/files/TestMMG.xlsx'

    importer = SDP::Importers::Spreadsheet.new(f, u, survey_name: 'Extended Import Test')
    importer.parse!
    importer.extend!(surveys(:one).id)

    s = Survey.where(name: 'Extended Import Test').first
    assert s.present?
    assert SECTION_COUNT + 2, s.sections.count
    first_ss = s.survey_sections.first
    assert_equal 0, first_ss.position
    assert_equal 'MyString', first_ss.section.name

    mmg_ss = s.survey_sections[2]
    assert_equal 2, mmg_ss.position
    assert_equal 'Data Elements', mmg_ss.section.name
  end

  test 'parse_spreedsheet' do
    u = users(:admin)
    f = './test/fixtures/files/TestMMG.xlsx'

    importer = SDP::Importers::Spreadsheet.new(f, u, mmg: false)
    importer.parse!

    rscount = ResponseSet.count
    rcount = Response.count
    qcount = Question.count
    sectioncount = Section.count
    surveycount = Survey.count

    importer.save!

    assert_equal rcount + RESPONSE_COUNT, Response.count
    assert_equal rscount + RESPONSE_SET_COUNT, ResponseSet.count
    assert_equal qcount  + QUESTION_COUNT * 2, Question.count
    assert_equal sectioncount + 2, Section.count
    assert_equal surveycount + SURVEY_COUNT, Survey.count

    assert Survey.where(name: f).exists?
    section = Section.where(name: 'Data Elements').first
    assert section.present?
    assert_equal section.questions.count, 4
    assert_equal section.concepts.count, 1
    assert_equal section.section_questions.first.position, 0
    assert_equal section.concepts.first.value, 'Data Elements'

    survey = Survey.where(name: f).first
    assert survey.sections.count, SECTION_COUNT
    assert survey.survey_sections.first.position, 0
  end
end
