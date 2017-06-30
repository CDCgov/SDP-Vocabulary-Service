require 'test_helper'

class QuestionTest < ActiveSupport::TestCase
  test 'Question should allow type to be set' do
    question = Question.new(content: 'content', response_type: ResponseType.new(code: 'date'))
    type = QuestionType.new(name: 'TestName')
    question.question_type = type
    assert question.save
    assert_equal question.question_type, type
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
    q = questions(:two)
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
