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

  test 'assign_new_oids' do
    user   = users(:admin)
    prefix = Form.oid_prefix

    f1 = Form.new(created_by: user)
    assert f1.save
    assert_equal 1, f1.version
    assert_equal "F-#{f1.id}", f1.version_independent_id
    assert_equal "#{prefix}.#{f1.id}", f1.oid

    f2 = Form.new(created_by: user)
    f2.oid = "#{prefix}.#{f1.id}"
    assert_not f2.valid?
    f2.oid = "#{prefix}.#{f1.id + 1}"
    assert f2.valid?
    assert f2.save

    f3 = Form.new(created_by: user)
    f3.oid = "#{prefix}.#{f2.id + 2}"
    assert f3.save

    f4 = Form.new(created_by: user)
    f4.oid = "#{prefix}.#{f2.id + 4}"
    assert f4.save

    # Should find next available oid which is f2.oid+3 NOT f4.oid+1
    f5 = Form.new(created_by: user)
    assert f5.save
    assert_equal "#{prefix}.#{f2.id + 3}", f5.oid

    # Should follow special validation rules for new versions
    f6 = Form.new(created_by: user)
    f6.version_independent_id = f1.version_independent_id
    f6.version = f1.version + 1
    assert f6.save
    assert_equal f1.oid, f6.oid

    f7 = Form.new(created_by: user)
    f7.version_independent_id = f1.version_independent_id
    f7.version = f1.version + 2
    f7.oid = f1.oid
    assert f7.save
    assert_equal f1.oid, f7.oid
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
    q = Question.new(content: 'Test publish', created_by: user)
    q.response_sets = [rs]
    assert q.save
    q2 = Question.new(content: 'Test publish 2', created_by: user)
    assert q2.save
    f = Form.new(name: 'Test publish', created_by: user)
    f.form_questions = [FormQuestion.new(question_id: q.id, response_set_id: rs.id), FormQuestion.new(question_id: q2.id, response_set_id: rs2.id)]
    assert f.save
    f.publish
    assert f.status == 'published'
    assert f.questions[0].status == 'published'
    assert f.questions[1].status == 'published'
    assert f.questions[0].response_sets.first.status == 'published'
    assert f.form_questions[1].response_set.status == 'published'
  end
end
