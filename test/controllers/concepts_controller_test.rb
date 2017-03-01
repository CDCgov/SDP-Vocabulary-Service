require 'test_helper'

class ConceptsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @question = questions(:one)
    @concept  = concepts(:one)
    sign_in users(:admin)
  end

  test 'should get index' do
    get concepts_url
    assert_response :success
  end

  test 'should get new' do
    get new_concept_url
    assert_response :success
  end

  test 'should create concept' do
    assert_difference('Concept.count') do
      post concepts_url, params: { concept: { question_id: @question.id, value: 'one' } }
    end

    assert_redirected_to concept_url(Concept.last)
  end

  test 'should show concept' do
    get concept_url(@concept)
    assert_response :success
  end

  test 'should get edit' do
    get edit_concept_url(@concept)
    assert_response :success
  end

  test 'should update concept' do
    patch concept_url(@concept), params: { concept: { question_id: @question.id, value: 'one' } }
    assert_redirected_to concept_url(@concept)
  end

  test 'should destroy concept' do
    assert_difference('Concept.count', -1) do
      delete concept_url(@concept)
    end
    assert_redirected_to(concepts_url)
  end
end
