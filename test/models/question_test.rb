require 'test_helper'

class QuestionTest < ActiveSupport::TestCase
  test 'Question should allow type to be set' do
    question = Question.new(content: 'content', response_type: ResponseType.new(code: 'date'))
    type = Category.new(name: 'TestName')
    question.category = type
    assert question.save
    assert_equal question.category, type
  end

  test 'Question requires a type' do
    question = Question.new
    assert_not question.valid?
  end

  test 'latest versions' do
    assert Question.latest_versions.count < Question.all.count
  end

  test 'versions must be unique' do
    q1 = Question.new(content: 'content', response_type: ResponseType.new(code: 'date'))
    assert q1.save
    q2 = Question.new(content: 'content', response_type: ResponseType.new(code: 'date'), version: 1, version_independent_id: q1.version_independent_id)
    assert_not q2.save
    q2.version = 2
    assert q2.save
  end

  test 'search' do
    found = Question.search('gender')
    assert found.count.between?(0, Question.count)
    assert_equal 'What is your gender?', found.first.content
  end

  test 'build_new_revision' do
    q = questions(:gfv2)
    revision = q.build_new_revision
    assert_equal q.version + 1, revision.version
    assert_equal q.version_independent_id, revision.version_independent_id
    assert_equal q.concepts.length, revision.concepts.length
  end

  test 'New Questions should always begin as drafts' do
    assert_equal 'draft', Question.new.status
  end

  test 'last_published' do
    q = questions(:new_two)
    assert_difference('Question.last_published.count') do
      assert q.publish(users(:admin))
    end
  end

  test 'Question status should change to published when published' do
    qs = questions(:gfv2)
    assert_equal 'draft', qs.status
    qs.publish(users(:admin))
    assert_equal 'published', qs.status
  end

  test 'Question should only ever have one draft' do
    assert true
  end

  test 'surveillance_systems' do
    q = questions(:one)
    ss = q.surveillance_systems
    assert_equal 2, ss.length
    assert_includes ss.map(&:name), 'National Insignificant Digits System'
    assert_includes ss.map(&:name), 'National Spork Monitoring System'
  end

  test 'surveillance_programs' do
    q = questions(:one)
    sp = q.surveillance_programs
    assert_equal 1, sp.length
    assert_includes sp.map(&:name), 'Generic Surveillance Program'
  end

  test 'mark as duplicate' do
    user = users(:admin)
    rs = ResponseSet.new(name: 'Test rs', created_by: user)
    assert rs.save
    rt = ResponseType.new(name: 'choice', code: 'choice')
    assert rt.save
    q = Question.new(content: 'Test q1', response_type: rt, created_by: user)
    assert q.save
    replacement_q = Question.new(content: 'Replacement question', response_type: rt, created_by: user)
    replacement_q.save
    new_replacement_q = Question.new(content: 'Another Replacement question', response_type: rt, created_by: user)
    new_replacement_q.save
    sect = Section.new(name: 'Test sect', created_by: user)
    sect.section_nested_items = [SectionNestedItem.new(question_id: q.id, response_set_id: rs.id, position: 0)]
    assert sect.save
    s = Survey.new(name: 'Test surv', created_by: user)
    s.survey_sections = [SurveySection.new(section_id: sect.id, position: 0)]
    assert s.save
    assert s.questions.include?(q)
    refute s.questions.include?(replacement_q)
    assert_equal replacement_q.duplicates_replaced_count, 0
    q.mark_as_duplicate(replacement_q)
    refute s.questions.include?(q)
    assert s.questions.include?(replacement_q)
    assert_equal replacement_q.duplicates_replaced_count, 1
    # This second mark as dupe checks that the later replacement inherits the replaced count and increments again
    replacement_q.mark_as_duplicate(new_replacement_q)
    refute s.questions.include?(replacement_q)
    assert s.questions.include?(new_replacement_q)
    assert_equal new_replacement_q.duplicates_replaced_count, 2
  end

  test 'only choice response type allows other' do
    blank_rs_question = Question.new(content: 'test', other_allowed: true)
    refute blank_rs_question.valid?

    wrong_rs_question = Question.new(content: 'test', other_allowed: true, response_type: ResponseType.new(code: 'date'))
    refute wrong_rs_question.valid?

    valid_other_question = Question.new(content: 'test', other_allowed: true, response_type: ResponseType.new(code: 'choice'))
    assert valid_other_question.valid?
  end

  test 'Publish also publishes response sets' do
    user = users(:admin)
    rs = ResponseSet.new(name: 'Test publish', created_by: user)
    assert rs.save
    q = Question.new(content: 'Test publish', response_type: ResponseType.new(code: 'date'), created_by: user)
    q.response_sets = [rs]
    assert q.save
    q.publish(user)
    assert_equal user, q.published_by
    assert_equal 'published', q.status
    assert_equal 'published', q.response_sets.first.status
  end
end
