require 'test_helper'
require 'sdp/importers/spreadsheet'

class MMGTest < ActiveSupport::TestCase
  SURVEY_COUNT = 1
  SECTION_COUNT = 3
  QUESTION_COUNT = 4
  RESPONSE_SET_COUNT = 2
  RESPONSE_COUNT = 6

  GENERIC_SURVEY_COUNT = 1
  GENERIC_SECTION_COUNT = 8
  GENERIC_QUESTION_COUNT = 21
  GENERIC_RESPONSE_SET_COUNT = 3
  GENERIC_RESPONSE_COUNT = 5

  test 'parse_mmg' do
    u = users(:admin)
    f = './test/fixtures/files/TestMMG.xlsx'

    importer = SDP::Importers::Spreadsheet.new(f, u, mmg: true)
    importer.parse!(true)

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
    assert_equal section.section_nested_items.first.position, 0
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

  test 'nested section import' do
    u = users(:admin)
    f = './test/fixtures/files/NestedTestMMG.xlsx'

    importer = SDP::Importers::Spreadsheet.new(f, u)
    importer.parse!
    importer.save!

    survey = Survey.where(name: f).first
    assert survey.present?

    section = survey.sections.where(name: 'Case Data').first
    first_question = section.section_nested_items[0]
    assert first_question.question.present?
    assert_equal 'RptComp', first_question.question.content
    nested_section = section.section_nested_items[1]
    assert nested_section.nested_section.present?
    assert_equal 'Nested Case Data', nested_section.nested_section.name
  end

  test 'parse_spreedsheet' do
    u = users(:admin)
    f = './test/fixtures/files/TestGenericTemplate.xlsx'

    importer = SDP::Importers::Spreadsheet.new(f, u, mmg: false)
    importer.parse!

    rscount = ResponseSet.count
    rcount = Response.count
    qcount = Question.count
    sectioncount = Section.count
    surveycount = Survey.count

    importer.save!
    assert_equal rcount + GENERIC_RESPONSE_COUNT, Response.count
    assert_equal rscount + GENERIC_RESPONSE_SET_COUNT, ResponseSet.count
    assert_equal qcount  + GENERIC_QUESTION_COUNT, Question.count
    assert_equal sectioncount + GENERIC_SECTION_COUNT, Section.count
    assert_equal surveycount + GENERIC_SURVEY_COUNT, Survey.count

    assert Survey.where(name: f).exists?
    section = Section.where(name: '1.1.1 Activate/deactivate decision').first
    assert section.present?
    assert_equal 7, section.questions.count
    assert_equal 1, section.concepts.count
    assert_equal '1.1 Decisions and approvals', section.parent.name

    q = section.section_nested_items.first.question
    assert q
    assert_equal 'Event ID activation/deactivation decision', q.content
    rs = q.response_sets.first
    assert rs
    assert_equal 'Decision Activate/Deactivate Flag', rs.name
  end

  test 'Handle a properly formatted section start marker' do
    row_contents = 'START: Message Structure Section'
    mr = SDP::Importers::MarkerRow.new(row_contents)
    assert_equal :section_start, mr.type
    assert_equal 'Message Structure Section', mr.text
  end

  test 'Handle a properly formatted section end marker' do
    row_contents = 'END: Message Structure Section'
    mr = SDP::Importers::MarkerRow.new(row_contents)
    assert_equal :section_end, mr.type
    assert_equal 'Message Structure Section', mr.text
  end

  test 'Handle a section start marker missing the colon' do
    row_contents = 'START Message Structure Section'
    mr = SDP::Importers::MarkerRow.new(row_contents)
    assert_equal :section_start, mr.type
    assert_equal 'Message Structure Section', mr.text
  end

  test 'Handle a section start marker in lower case' do
    row_contents = 'start: Message Structure Section'
    mr = SDP::Importers::MarkerRow.new(row_contents)
    assert_equal :section_start, mr.type
    assert_equal 'Message Structure Section', mr.text
  end

  test 'Handle a section start marker with leading whitespace' do
    row_contents = '    start: Message Structure Section'
    mr = SDP::Importers::MarkerRow.new(row_contents)
    assert_equal :section_start, mr.type
    assert_equal 'Message Structure Section', mr.text
  end

  test 'Trim gross section markers' do
    row_contents = "START: EPIDEMIOLOGIC INFORMATION SECTION: The observations in this section will be mapped under a \"Epidemiologic Information\" category OBR segment with an OBR-4 value of '68991-9^Epidemiologic Information^LN' "
    mr = SDP::Importers::MarkerRow.new(row_contents)
    assert_equal :section_start, mr.type
    assert_equal 'EPIDEMIOLOGIC INFORMATION SECTION', mr.text
  end

  test 'Trim in marker notes' do
    row_contents = 'START: Travel History Repeating Questions   NOTE:  This group repeats for any concepts related to the assigned value set that are collected for the condition reported.'
    mr = SDP::Importers::MarkerRow.new(row_contents)
    assert_equal :section_start, mr.type
    assert_equal 'Travel History Repeating Questions', mr.text
  end
end
