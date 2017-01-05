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
end
