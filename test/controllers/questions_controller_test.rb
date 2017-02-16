require 'test_helper'

class QuestionsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers
  include ActiveJob::TestHelper

  setup do
    @question = questions(:one)
    @current_user = users(:admin)
    sign_in @current_user
  end

  test 'should get index' do
    get questions_url, xhr: true, params: nil
    assert_response :success
  end

  test 'should create a draft question' do
    assert_enqueued_jobs 0
    assert_difference('Question.count') do
      post questions_url, params: { question: { content: @question.content, question_type_id: @question.question_type.id } }
    end
    assert_enqueued_jobs 1
    assert_equal @current_user.id, Question.last.created_by.id
    assert_equal 'draft', Question.last.status
    assert_redirected_to question_url(Question.last)
  end

  test 'should update a draft question' do
    patch question_url(@question, format: :json), params: { question: { content: 'new content' } }
    assert_equal 'new content', Question.last.content
  end

  test 'should be unable to update a published question' do
    assert_equal 'draft', Question.last.status
    patch publish_question_path(@question, format: :json)
    assert_equal 'published', Question.last.status
    patch question_url(@question, format: :json), params: { question: { content: 'secret content' } }
    assert_response :unprocessable_entity
    assert_nil Question.find_by(content: 'secret content')
  end

  test 'should publish a draft question' do
    assert_equal 'draft', Question.last.status
    patch publish_question_path(@question, format: :json)
    assert_equal 'published', Question.last.status
  end

  test 'should destroy question' do
    # TODO
    assert false
    # assert_enqueued_jobs 0
    # assert_difference('Question.count', -1) do
    # delete question_url(@question)
    # end
    # assert_enqueued_jobs 1
    # assert_response :success
  end
end
