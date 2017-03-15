require 'test_helper'
require 'sdp/importers/redcap'

class Redcap < ActiveSupport::TestCase
  # Essentially testing that Versionable is working in Form
  FORM_COUNT = 5
  QUESTION_COUNT = 198
  ITEM_GROUP_COUNT = 16
  RESPONSE_SET_COUNT = 67
  test 'parse_redcap_file' do
    u = users(:admin)
    f = File.new('./test/fixtures/files/redcap.xml')
    importer = SDP::Importers::Redcap.new(f, u)
    rs = importer.parse_response_sets
    assert_equal RESPONSE_SET_COUNT, rs.values.length
    questions = importer.parse_questions(rs)
    assert_equal  QUESTION_COUNT, questions.values.length
    item_groups = importer.parse_item_groups(questions)
    assert_equal ITEM_GROUP_COUNT, item_groups.values.length
    forms = importer.parse_forms(item_groups)
    assert_equal FORM_COUNT, forms.values.length

    rscount = ResponseSet.count
    qcount  = Question.count
    formcount = Form.count

    forms.each_pair do |_k, v|
      v.save
    end
    assert_equal rscount + RESPONSE_SET_COUNT, ResponseSet.count
    assert_equal qcount  + QUESTION_COUNT, Question.count
    assert_equal formcount + FORM_COUNT, Form.count
  end
end
