require 'test_helper'

class FormsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers
  include ActiveJob::TestHelper

  DRAFT = 'draft'.freeze
  PUBLISHED = 'published'.freeze

  setup do
    @form = forms(:one)
    @current_user = users(:admin)
    sign_in @current_user
  end

  test 'should get index' do
    get forms_url, xhr: true, params: nil
    assert_response :success
  end

  test 'revisions should increment version without needing a param' do
    form_json = { form: { name: @form.name, version_independent_id: 'F-1337' } }.to_json
    post forms_url, params: form_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    Form.last.publish
    v1 = Form.last
    form_json = { form: { name: 'A revised name', version_independent_id: 'F-1337' } }.to_json
    post forms_url, params: form_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    assert_response :success
    v2 = Form.last
    assert_equal v1.version_independent_id, v2.version_independent_id
    assert_equal v1.version + 1, v2.version
    assert_equal 'A revised name', v2.name
  end

  test 'cannot revise something you do not own' do
    form_json = { form: { name: @form.name, version_independent_id: 'F-1337' } }.to_json
    post forms_url, params: form_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    Form.last.publish
    sign_in users(:not_admin)
    form_json = { form: { name: 'A Failed revision', version_independent_id: 'F-1337' } }.to_json
    post forms_url, params: form_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    assert_response :unauthorized
  end

  test 'cannot revise a draft' do
    form_json = { form: { name: @form.name, version_independent_id: 'F-1337' } }.to_json
    post forms_url, params: form_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    assert_equal DRAFT, Form.last.status
    form_json = { form: { name: 'A Failed revision', version_independent_id: 'F-1337' } }.to_json
    post forms_url, params: form_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    assert_response :unprocessable_entity
  end

  test 'should get my forms' do
    get my_forms_url, xhr: true, params: nil
    assert_response :success
    JSON.parse(response.body).each do |f|
      assert f['created_by_id'] == @current_user.id
    end
  end

  test 'should create form' do
    assert_enqueued_jobs 0

    assert_difference('Form.count') do
      form_json = { form: { name: @form.name, created_by_id: @form.created_by_id } }.to_json
      post forms_url, params: form_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    end
    assert_enqueued_jobs 1

    assert_response :success
  end

  test 'should update a form' do
    assert_enqueued_jobs 0

    draft_form = forms(:draft)

    form_json = { form: { name: draft_form.name, created_by_id: @form.created_by_id, control_number: '5678-5678' } }.to_json
    put form_url(draft_form), params: form_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }

    assert_enqueued_jobs 1

    assert_response :success
  end

  test 'should show form' do
    get form_url(@form), xhr: true, params: nil
    assert_response :success
  end

  test 'should not publish an already published form' do
    put publish_form_url(@form), xhr: true, params: nil
    assert_response :unprocessable_entity
  end

  test 'should publish a draft form' do
    put publish_form_url(forms(:draft)), xhr: true, params: nil
    assert_response :success
  end

  test 'should get export' do
    get export_form_url(@form)
    assert_response :success
  end

  test 'should get redcap export ' do
    get redcap_form_url(@form)
    assert response.headers['Content-Disposition'].index("filename=\"#{@form.name.underscore}_redcap.xml\"")
    validate_redcap(response.body)
    assert_response :success
  end

  test 'should destroy form' do
    assert_enqueued_jobs 0
    assert_difference('Form.count', -1) do
      delete form_url(@form)
    end
    assert_enqueued_jobs 3
    assert_redirected_to forms_url
  end

  test 'should respond to json format' do
    get form_url(@form, format: :json)
    assert_response :success
    assert_response_schema('forms/show_default.json')
  end

  private

  def validate_redcap(xml)
    doc = Nokogiri::XML::Document.parse(xml)
    doc.root.add_namespace_definition('odm', 'http://www.cdisc.org/ns/odm/v1.3')
    doc.root.add_namespace_definition('ds', 'http://www.w3.org/2000/09/xmldsig#')
    doc.root.add_namespace_definition('xsi', 'http://www.w3.org/2001/XMLSchema-instance')
    doc.root.add_namespace_definition('redcap', 'https://projectredcap.org')
    assert doc
    assert doc.at_xpath("/odm:ODM/odm:Study[@OID='Project.Test']")
  end
end
