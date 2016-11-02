require 'test_helper'

class FormQuestionsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @form_question = form_questions(:one)
    sign_in users(:admin)
  end

  test 'should get index' do
    get form_questions_url
    assert_response :success
  end

  test 'should get new' do
    get new_form_question_url
    assert_response :success
  end

  test 'should create form_question' do
    assert_difference('FormQuestion.count') do
      post form_questions_url, params: { form_question: { form_id: @form_question.form_id, question_id: @form_question.question_id, response_set_id: @form_question.response_set_id } }
    end

    assert_redirected_to form_question_url(FormQuestion.last)
  end

  test 'should show form_question' do
    get form_question_url(@form_question)
    assert_response :success
  end

  test 'should get edit' do
    get edit_form_question_url(@form_question)
    assert_response :success
  end

  test 'should update form_question' do
    patch form_question_url(@form_question), params: { form_question: { form_id: @form_question.form_id, question_id: @form_question.question_id, response_set_id: @form_question.response_set_id } }
    assert_redirected_to form_question_url(@form_question)
  end

  test 'should destroy form_question' do
    assert_difference('FormQuestion.count', -1) do
      delete form_question_url(@form_question)
    end

    assert_redirected_to form_questions_url
  end
end
