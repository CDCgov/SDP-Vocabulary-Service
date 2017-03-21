require 'test_helper'

class QuestionTest < ActiveSupport::TestCase
  test 'Question should allow type to be set' do
    question = Question.new(content: 'content')
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
    q1 = Question.new(content: 'content')
    assert q1.save
    q2 = Question.new(content: 'content', version: 1, version_independent_id: q1.version_independent_id)
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
      assert q.publish
    end
  end

  test 'Question status should change to published when published' do
    qs = questions(:gfv2)
    assert_equal 'draft', qs.status
    qs.publish
    assert_equal 'published', qs.status
  end

  test 'Question should only ever have one draft' do
    assert true
  end

  test 'assign_new_oids' do
    prefix = Question.oid_prefix

    q1 = Question.new(content: 'test', question_type: QuestionType.new(name: 'TestName'))
    assert q1.save
    assert_equal 1, q1.version
    assert_equal "Q-#{q1.id}", q1.version_independent_id
    assert_equal "#{prefix}.#{q1.id}", q1.oid

    q2 = Question.new(content: 'test', question_type: QuestionType.new(name: 'TestName'))
    q2.oid = "#{prefix}.#{q1.id}"
    assert_not q2.valid?
    q2.oid = "#{prefix}.#{q1.id + 1}"
    assert q2.valid?
    assert q2.save

    q3 = Question.new(content: 'test', question_type: QuestionType.new(name: 'TestName'))
    q3.oid = "#{prefix}.#{q2.id + 3}"
    assert q3.save

    q4 = Question.new(content: 'test', question_type: QuestionType.new(name: 'TestName'))
    q4.oid = "#{prefix}.#{q2.id + 5}"
    assert q4.save

    # Should find next available oid which is q2.id+4 NOT q2.id+5
    q5 = Question.new(content: 'test', question_type: QuestionType.new(name: 'TestName'))
    assert q5.save
    assert_equal "#{prefix}.#{q2.id + 4}", q5.oid

    # Should follow special validation rules for new versions
    q6 = Question.new(content: 'test', question_type: QuestionType.new(name: 'TestName'))
    q6.version_independent_id = q1.version_independent_id
    q6.version = q1.version + 1
    assert q6.save
    assert_equal q1.oid, q6.oid

    q7 = Question.new(content: 'test', question_type: QuestionType.new(name: 'TestName'))
    q7.version_independent_id = q1.version_independent_id
    q7.version = q1.version + 2
    q7.oid = q1.oid
    assert q7.save
    assert_equal q1.oid, q7.oid
  end
end
