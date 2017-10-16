require 'test_helper'

class SectionTest < ActiveSupport::TestCase
  # Essentially testing that Versionable is working in Section
  test 'build_new_revisions' do
    rs = sections(:one)
    revision = rs.build_new_revision
    assert_equal 2, revision.version
    assert_equal 'F-1', revision.version_independent_id
    assert_equal '2.16.840.1.113883.3.1502.1.1', revision.oid

    rs = sections(:two)
    revision = rs.build_new_revision
    assert_equal 2, revision.version
    assert_equal 'F-2', revision.version_independent_id
    assert_nil revision.oid
  end

  test 'make sure the OMB control number is unique' do
    f = Section.new(name: 'Doubly Double', control_number: '1234-5678')
    assert_not f.save
  end

  test 'same OMB control number is OK across versions' do
    f = sections(:one)
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
    f = Section.new(name: 'Test publish', created_by: user)
    f.section_questions = [SectionQuestion.new(question_id: q.id, response_set_id: rs.id, position: 0), SectionQuestion.new(question_id: q2.id, response_set_id: rs2.id, position: 1), SectionQuestion.new(question_id: q3.id, position: 2)]
    assert f.save
    f.publish(user)
    assert_equal user, f.published_by
    assert_equal 'published', f.status
    assert_equal 'published', f.questions[0].status
    assert_equal 'published', f.questions[1].status
    assert_equal 'published', f.questions[2].status
    assert_equal 'published', f.section_questions[0].response_set.status
    assert_equal 'published', f.section_questions[1].response_set.status
  end

  test 'Deleting a question deletes its section question and preserves position' do
    user = users(:admin)
    rs = ResponseSet.new(name: 'Test Delete', created_by: user)
    assert rs.save
    q1 = Question.new(content: 'Test Delete 1', response_type: ResponseType.new(name: 'choice', code: 'choice'), created_by: user)
    assert q1.save
    q2 = Question.new(content: 'Test Delete 2', response_type: ResponseType.new(name: 'choice', code: 'choice'), created_by: user)
    assert q2.save
    q3 = Question.new(content: 'Test Delete 3', response_type: ResponseType.new(name: 'choice', code: 'choice'), created_by: user)
    assert q3.save
    f = Section.new(name: 'Test Delete 2', created_by: user)
    f.section_questions = [SectionQuestion.new(question_id: q1.id, response_set_id: rs.id, position: 0), SectionQuestion.new(question_id: q2.id, response_set_id: rs.id, position: 0), SectionQuestion.new(question_id: q3.id, response_set_id: rs.id, position: 0)]
    assert f.save
    # Need to wait for the async queue to finish its work before destroying the section, or it crashes
    sleep 5
    assert q2.destroy
    f = Section.find(f.id)
    assert_equal 2, f.section_questions.size
    assert_equal 0, f.section_questions[0].position
    assert_equal 1, f.section_questions[1].position
    assert_equal q1.id, f.section_questions[0].question_id
    assert_equal q3.id, f.section_questions[1].question_id
  end

  test 'Getting questions with most_recent loaded' do
    f = sections(:one)
    qs = f.questions_with_most_recent
    old_question = qs.find { |q| q.content == 'What is another question example?' }
    assert_equal 1, old_question.version
    assert_equal 2, old_question.max_version
    assert_equal 2, old_question.most_recent
  end
end
