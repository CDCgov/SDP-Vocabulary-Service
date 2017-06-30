require 'test_helper'

class FormTest < ActiveSupport::TestCase
  # Essentially testing that Versionable is working in Form
  test 'build_new_revisions' do
    rs = forms(:one)
    revision = rs.build_new_revision
    assert_equal 2, revision.version
    assert_equal 'F-1', revision.version_independent_id
    assert_equal '2.16.840.1.113883.3.1502.1.1', revision.oid

    rs = forms(:two)
    revision = rs.build_new_revision
    assert_equal 2, revision.version
    assert_equal 'F-2', revision.version_independent_id
    assert_nil revision.oid
  end

  test 'make sure the OMB control number is unique' do
    f = Form.new(name: 'Doubly Double', control_number: '1234-5678')
    assert_not f.save
  end

  test 'same OMB control number is OK across versions' do
    f = forms(:one)
    revision = f.build_new_revision
    assert_equal 2, revision.version
    assert revision.save
    assert_equal f.control_number, revision.control_number
  end

  test 'Publish also publishes questions and response sets' do
    user = users(:admin)
    rs = ResponseSet.new(name: 'Test publish', created_by: user)
    assert rs.save
    rs2 = ResponseSet.new(name: 'Test publish 2', created_by: user)
    assert rs2.save
    rt = ResponseType.new(name: 'choice', code: 'choice')
    assert rt.save
    q = Question.new(content: 'Test publish', response_type: rt, created_by: user)
    q.response_sets = [rs]
    assert q.save
    q2 = Question.new(content: 'Test publish 2', response_type: rt, created_by: user)
    assert q2.save
    q3 = Question.new(content: 'Test publish 3', response_type: rt, created_by: user)
    assert q3.save
    f = Form.new(name: 'Test publish', created_by: user)
    f.form_questions = [FormQuestion.new(question_id: q.id, response_set_id: rs.id, position: 0), FormQuestion.new(question_id: q2.id, response_set_id: rs2.id, position: 1), FormQuestion.new(question_id: q3.id, position: 2)]
    assert f.save
    f.publish(user)
    assert_equal user, f.published_by
    assert_equal 'published', f.status
    assert_equal 'published', f.questions[0].status
    assert_equal 'published', f.questions[1].status
    assert_equal 'published', f.questions[2].status
    assert_equal 'published', f.form_questions[0].response_set.status
    assert_equal 'published', f.form_questions[1].response_set.status
  end
end
