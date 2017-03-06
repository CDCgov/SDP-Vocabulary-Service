require 'test_helper'

class QuestionsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers
  include ActiveJob::TestHelper

  setup do
    @question  = questions(:one)
    @question5 = questions(:five)
    @current_user = users(:admin)
    sign_in @current_user
  end

  test 'should get index' do
    get questions_url, xhr: true, params: nil
    assert_response :success
  end

  test 'should get my questions' do
    get my_questions_url, xhr: true, params: nil
    assert_response :success
    JSON.parse(response.body).each do |f|
      assert f['created_by']['id'] == @current_user.id
    end
  end

  test 'should create a draft question' do
    assert_enqueued_jobs 0
    assert_difference('Question.count') do
      post questions_url, params: { question: { content: 'Unique content', question_type_id: @question.question_type.id } }
    end
    assert_enqueued_jobs 1
    assert_equal 'draft', Question.last.status
    assert_equal 'Unique content', Question.last.content
    assert_redirected_to question_url(Question.last)
  end

  test 'should update a draft question' do
    post questions_url, params: { question: { content: 'TBD content', question_type_id: @question.question_type.id } }
    assert_equal 'draft', Question.last.status
    put question_url(Question.last, format: :json), params: { question: { content: 'new content' } }
    assert_equal 'new content', Question.last.content
  end

  test 'should be unable to update a draft question owned by someone else' do
    patch question_url(@question5, format: :json), params: { question: { content: 'new content' } }
    assert_response :unauthorized
  end

  test 'should be unable to update a published question' do
    post questions_url, params: { question: { content: 'TBD content', question_type_id: @question.question_type.id } }
    assert_equal 'draft', Question.last.status
    put publish_question_path(Question.last, format: :json)
    assert_equal 'published', Question.last.status
    patch question_url(Question.last, format: :json), params: { question: { content: 'secret content' } }
    assert_response :unprocessable_entity
    assert_nil Question.find_by(content: 'secret content')
  end

  test 'should publish a draft question' do
    post questions_url, params: { question: { content: 'TBD content', question_type_id: @question.question_type.id } }
    assert_equal 'draft', Question.last.status
    put publish_question_path(Question.last, format: :json)
    assert_equal 'published', Question.last.status
  end

  test 'should fail to destroy a published question' do
    post questions_url, params: { question: { content: 'TBD content', question_type_id: @question.question_type.id } }
    assert_equal 'draft', Question.last.status
    put publish_question_path(Question.last, format: :json)
    assert_equal 'published', Question.last.status
    assert_response :success
    delete question_url(Question.last)
    assert_response 422
    # TODO: deprecation
  end

  test 'should destroy  a draft question' do
    post questions_url, params: { question: { content: 'TBD content', question_type_id: @question.question_type.id } }
    assert_equal Question.last.status, 'draft'
    last_id = Question.last.id
    assert_difference('Question.count', -1) do
      delete question_url(Question.last)
    end
    assert_response :success
    assert_not_equal last_id, Question.last
  end
end
