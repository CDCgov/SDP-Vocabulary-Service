require 'test_helper'

class SurveyTest < ActiveSupport::TestCase
  test 'has survey forms' do
    s = surveys(:one)
    assert_equal 2, s.survey_forms.length
  end

  test 'same OMB control number is OK across versions' do
    s = surveys(:one)
    revision = s.build_new_revision
    assert_equal 2, revision.version
    assert revision.save
    assert_equal s.control_number, revision.control_number
  end

  test ' invalid control number should not be valid' do
    s = surveys(:one)
    s.control_number = '1234'
    assert_not s.valid?
  end

  test 'Publish also publishes forms, questions, and response sets' do
    user = users(:admin)
    rs = ResponseSet.new(name: 'Test publish', created_by: user)
    assert rs.save
    q = Question.new(content: 'Test publish', created_by: user)
    q.response_sets = [rs]
    assert q.save
    f = Form.new(name: 'Test publish', created_by: user)
    f.form_questions = [FormQuestion.new(question_id: q.id, response_set_id: rs.id, position: 0)]
    assert f.save
    s = Survey.new(name: 'Test publish', created_by: user)
    s.survey_forms = [SurveyForm.new(form_id: f.id, position: 0)]
    assert s.save
    s.publish(user)
    assert_equal user, s.published_by
    assert_equal 'published', s.status
    assert_equal 'published', s.forms.first.status
    assert_equal 'published', s.forms.first.questions.first.status
    assert_equal 'published', s.forms.first.questions.first.response_sets.first.status
  end
end
