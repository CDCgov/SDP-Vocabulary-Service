require 'test_helper'

class QuestionTest < ActiveSupport::TestCase
  test 'Question should allow type to be set' do
    question = Question.new
    type = QuestionType.new(name: 'TestName')
    question.question_type = type
    assert_equal question.question_type, type
  end

  test 'Question requires a type' do
    question = Question.new
    assert_not question.valid?
  end

  test 'latest versions' do
    assert_equal 3, Question.latest_versions.count
  end

  test 'search' do
    assert 3, Question.count
    found = Question.search('gender')
    assert 1, found.count
    assert 'What is your gender?', found.first.content
  end


  test 'build_new_revision' do
    qs = questions(:gfv2)
    revision = qs.build_new_revision
    assert_equal 3, revision.version
    assert_equal 'Q-3', revision.version_independent_id
    assert_equal 2, revision.concepts.length
  end
  test 'assign_new_oids' do
    prefix = Question.oid_prefix

    q = Question.new(id: 3, content: 'test', question_type: QuestionType.new(name: 'TestName'))
    q.id = 3
    q.save
    assert_equal 1, q.version
    assert_equal 'Q-3', q.version_independent_id
    assert_equal "#{prefix}.3", q.oid

    q = Question.new(id: 4, content: 'test', question_type: QuestionType.new(name: 'TestName'))
    q.oid = "#{prefix}.3"
    assert_not q.valid?
    q.oid = "#{prefix}.4"
    assert q.valid?
    q.save

    q = Question.new(id: 5, content: 'test', question_type: QuestionType.new(name: 'TestName'))
    q.oid = "#{prefix}.7"
    q.save

    q = Question.new(id: 6, content: 'test', question_type: QuestionType.new(name: 'TestName'))
    q.oid = "#{prefix}.9"
    q.save

    # Should find next available oid which is .8 NOT .10
    q = Question.new(id: 7, content: 'test', question_type: QuestionType.new(name: 'TestName'))
    q.save
    assert_equal "#{prefix}.8", q.oid

    # Should follow special validation rules for new versions
    q2 = Question.new(content: 'test', question_type: QuestionType.new(name: 'TestName'))
    q2.version_independent_id = q.version_independent_id
    q2.version = 2
    q2.save
    assert_equal q.oid, q2.oid

    q3 = Question.new(content: 'test', question_type: QuestionType.new(name: 'TestName'))
    q3.version_independent_id = q.version_independent_id
    q3.version = 3
    q3.oid = q.oid
    q3.save
    assert_equal q.oid, q3.oid
  end
end
