require 'test_helper'

class FormsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @form = forms(:one)
    sign_in users(:admin)
  end

  test 'should get index' do
    get forms_url
    assert_response :success
  end

  test 'should get new' do
    get new_form_url
    assert_response :success
  end

  test 'should create form' do
    assert_difference('Form.count') do
      post forms_url, params: { form: { name: @form.name, created_by_id: @form.created_by_id } }
    end

    assert_redirected_to form_url(Form.last)
  end

  test 'should show form' do
    get form_url(@form)
    assert_response :success
  end

  test 'should get edit' do
    get edit_form_url(@form)
    assert_response :success
  end

  test 'should update form' do
    patch form_url(@form), params: { form: { name: @form.name, created_by_id: @form.created_by_id } }
    assert_redirected_to form_url(@form)
  end

  test 'should destroy form' do
    assert_difference('Form.count', -1) do
      delete form_url(@form)
    end

    assert_redirected_to forms_url
  end
end
