require 'test_helper'

class SectionTest < ActiveSupport::TestCase
  # Essentially testing that Versionable is working in Section
  test 'build_new_revisions' do
    rs = sections(:one)
    revision = rs.build_new_revision
    assert_equal 2, revision.version
    assert_equal 'SECT-1', revision.version_independent_id
    assert_equal '2.16.840.1.113883.3.1502.1.1', revision.oid

    rs = sections(:two)
    revision = rs.build_new_revision
    assert_equal 2, revision.version
    assert_equal 'SECT-2', revision.version_independent_id
    assert_nil revision.oid
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
    sect = Section.new(name: 'Test publish', created_by: user)
    sect.section_nested_items = [SectionNestedItem.new(question_id: q.id, response_set_id: rs.id, position: 0), SectionNestedItem.new(question_id: q2.id, response_set_id: rs2.id, position: 1), SectionNestedItem.new(question_id: q3.id, position: 2)]
    assert sect.save
    sect.publish(user)
    assert_equal user, sect.published_by
    assert_equal 'published', sect.status
    assert_equal 'published', sect.questions[0].status
    assert_equal 'published', sect.questions[1].status
    assert_equal 'published', sect.questions[2].status
    assert_equal 'published', sect.section_nested_items[0].response_set.status
    assert_equal 'published', sect.section_nested_items[1].response_set.status
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
    sect = Section.new(name: 'Test Delete 2', created_by: user)
    sect.section_nested_items = [SectionNestedItem.new(question_id: q1.id, response_set_id: rs.id, position: 0), SectionNestedItem.new(question_id: q2.id, response_set_id: rs.id, position: 0), SectionNestedItem.new(question_id: q3.id, response_set_id: rs.id, position: 0)]
    assert sect.save
    # Need to wait for the async queue to finish its work before destroying the section, or it crashes
    sleep 5
    assert q2.destroy
    sect = Section.find(sect.id)
    assert_equal 2, sect.section_nested_items.size
    assert_equal 0, sect.section_nested_items[0].position
    assert_equal 1, sect.section_nested_items[1].position
    assert_equal q1.id, sect.section_nested_items[0].question_id
    assert_equal q3.id, sect.section_nested_items[1].question_id
  end

  test 'Getting questions with most_recent loaded' do
    sect = sections(:one)
    qs = sect.questions_with_most_recent
    old_question = qs.find { |q| q.content == 'What is another question example?' }
    assert_equal 1, old_question.version
    assert_equal 2, old_question.max_version
    assert_equal 2, old_question.most_recent
  end

  test 'Run dupe count and dupes' do
    user = users(:admin)
    rs = ResponseSet.new(name: 'Test Delete', created_by: user)
    assert rs.save
    q1 = Question.new(content: 'Test Delete 1', response_type: ResponseType.new(name: 'choice', code: 'choice'), created_by: user)
    assert q1.save
    q2 = Question.new(content: 'Test Delete 2', response_type: ResponseType.new(name: 'choice', code: 'choice'), created_by: user)
    assert q2.save
    q3 = Question.new(content: 'Test Delete 3', response_type: ResponseType.new(name: 'choice', code: 'choice'), created_by: user)
    assert q3.save
    sect = Section.new(name: 'Test Delete 2', created_by: user)
    sect.section_nested_items = [SectionNestedItem.new(question_id: q1.id, response_set_id: rs.id, position: 0), SectionNestedItem.new(question_id: q2.id, response_set_id: rs.id, position: 0), SectionNestedItem.new(question_id: q3.id, response_set_id: rs.id, position: 0)]
    assert sect.save
    dupe_count = sect.q_with_dupes_count(user)
    assert_equal 0, dupe_count
  end
end
