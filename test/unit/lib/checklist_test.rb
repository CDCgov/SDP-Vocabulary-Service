require 'test_helper'
require 'sdp/importers/checklist'

class ChecklistTest < ActiveSupport::TestCase
  setup do
    @user = users(:admin)
  end

  test 'import' do
    assert_changes -> { Survey.count } do
      SDP::Importers::Checklist.import('./test/fixtures/files/checklist/header.xml', @user)
    end

    s = Survey.find_by(name: 'Guidelines - Do Before Surgery')
    assert s
    assert_equal s.created_by, @user
  end

  test 'process_sections' do
    s = Survey.create(name: 'Section Test', created_by: @user)
    raw_xml = File.read('./test/fixtures/files/checklist/sections.xml')
    xml = Nokogiri::XML(raw_xml)
    SDP::Importers::Checklist.process_sections(xml.xpath('/test/header-group'), s, @user)
    s.reload
    assert_equal 2, s.sections.count
    section = s.sections.first
    assert_equal 'Provider', section.name
    assert_equal @user, section.created_by
  end

  test 'simple process_questions' do
    s = Section.create(name: 'Simple Question Test', created_by: @user)
    raw_xml = File.read('./test/fixtures/files/checklist/simple_question.xml')
    xml = Nokogiri::XML(raw_xml)
    SDP::Importers::Checklist.process_questions(xml.xpath('/test/question'), s, @user)
    s.reload
    assert_equal 1, s.questions.count
    q = s.questions.first
    assert_equal 'Hand Washing', q.content
    assert_equal 'What kind of soap did you use?', q.description
    assert_equal 3, q.response_sets.first.responses.count
    assert_includes q.response_sets.first.responses.map(&:value), 'Gel'
  end

  test 'sub_question process_questions' do
    s = Section.create(name: 'Simple Question Test', created_by: @user)
    raw_xml = File.read('./test/fixtures/files/checklist/sub_question.xml')
    xml = Nokogiri::XML(raw_xml)
    SDP::Importers::Checklist.process_questions(xml.xpath('/test/question'), s, @user)
    s.reload
    assert_equal 1, s.questions.count
    q = s.questions.first
    assert_equal 'Hand Washing', q.content
    assert_equal 'What kind of soap did you use?', q.description
    assert_equal 4, q.response_sets.first.responses.count
    assert_includes q.response_sets.first.responses.map(&:value), 'Foamy - Scented'
  end

  test 'datatype sub_question process_questions' do
    s = Section.create(name: 'Simple Question Test', created_by: @user)
    raw_xml = File.read('./test/fixtures/files/checklist/datatype_sub_question.xml')
    xml = Nokogiri::XML(raw_xml)
    SDP::Importers::Checklist.process_questions(xml.xpath('/test/question'), s, @user)
    s.reload
    assert_equal 2, s.questions.count
    q = s.questions.first
    assert_equal 'Hand Washing', q.content
    assert_equal 'What kind of soap did you use?', q.description
    assert_equal 5, q.response_sets.first.responses.count
    assert_includes q.response_sets.first.responses.map(&:value), 'Foamy - Scented'
    assert_includes q.response_sets.first.responses.map(&:value), 'Multiple Bars of Soap'
    bars_question = s.questions[1]
    assert_equal 'Multiple Bars of Soap - Number Used', bars_question.content
  end
end
