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
    q = Question.new(content: 'Test publish', response_type: ResponseType.new(name: 'choice', code: 'choice'), created_by: user)
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

  test 'Deleting a form deletes its survey form and preserves position' do
    user = users(:admin)
    rs = ResponseSet.new(name: 'Test Delete', created_by: user)
    assert rs.save
    q = Question.new(content: 'Test Delete', response_type: ResponseType.new(name: 'choice', code: 'choice'), created_by: user)
    q.response_sets = [rs]
    assert q.save
    f1 = Form.new(name: 'Test Delete 1', created_by: user)
    assert f1.save
    f2 = Form.new(name: 'Test Delete 2', created_by: user)
    f2.form_questions = [FormQuestion.new(question_id: q.id, response_set_id: rs.id, position: 0)]
    assert f2.save
    f3 = Form.new(name: 'Test Delete 3', created_by: user)
    assert f3.save
    s = Survey.new(name: 'Test Delete', created_by: user)
    s.survey_forms = [SurveyForm.new(form_id: f1.id, position: 0), SurveyForm.new(form_id: f2.id, position: 1), SurveyForm.new(form_id: f3.id, position: 2)]
    assert s.save
    # Need to wait for the async queue to finish its work before destroying the form, or it crashes
    sleep 5
    assert f2.destroy
    s = Survey.find(s.id)
    assert_equal 2, s.survey_forms.size
    assert_equal 0, s.survey_forms[0].position
    assert_equal 1, s.survey_forms[1].position
    assert_equal f1.id, s.survey_forms[0].form_id
    assert_equal f3.id, s.survey_forms[1].form_id
  end
end
