require 'test_helper'
require 'sdp/importers/redcap'

class Redcap < ActiveSupport::TestCase
  # Essentially testing that Versionable is working in Form
  test 'parse_redcap_file' do
    u = users(:admin)
    f = File.new('./test/fixtures/files/redcap.xml')
    importer = SDP::Importers::Redcap.new(f, u)
    rs = importer.parse_response_sets
    assert_equal 67, rs.values.length
    questions = importer.parse_questions(rs)
    assert_equal  198, questions.values.length
    item_groups = importer.parse_item_groups(questions)
    assert_equal 16, item_groups.values.length
    forms = importer.parse_forms(item_groups)
    assert_equal 5, forms.values.length

    rscount = ResponseSet.count
    qcount  = Question.count
    formcount = Form.count

    forms.each_pair do |_k, v|
      v.save
    end

    assert_equal rscount + 67,  ResponseSet.count
    assert_equal qcount  + 198, Question.count
    assert_equal formcount + 5, Form.count
  end
end
