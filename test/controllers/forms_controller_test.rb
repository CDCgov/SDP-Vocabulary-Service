require 'test_helper'

class FormsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers
  include ActiveJob::TestHelper
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
    assert_enqueued_jobs 0

    assert_difference('Form.count') do
      post forms_url, params: { form: { name: @form.name, created_by_id: @form.created_by_id } }
    end
    assert_enqueued_jobs 1

    assert_redirected_to form_url(Form.last)
  end

  test 'should show form' do
    get form_url(@form)
    assert_response :success
  end

  test 'should get revise' do
    assert_enqueued_jobs 0
    get revise_form_url(@form)
    assert_response :success
    assert_enqueued_jobs 0
  end

  test 'should get export' do
    get export_form_url(@form)
    assert_response :success
  end

  test 'should get redcap export ' do
    get redcap_form_url(@form)
    assert response.headers['Content-Disposition'].index("filename=\"#{@form.name.underscore}_redcap.xml\"")
    valiedate_redcap(response.body)
    assert_response :success
  end

  test 'should destroy form' do
    assert_enqueued_jobs 0
    assert_difference('Form.count', -1) do
      delete form_url(@form)
    end
    assert_enqueued_jobs 1
    assert_redirected_to forms_url
  end

  test 'should respond to json format' do
    get form_url(@form, format: :json)
    assert_response :success
    assert_response_schema('forms/show_default.json')
  end

  private

  def valiedate_redcap(xml)
    doc = Nokogiri::XML::Document.parse(xml)
    doc.root.add_namespace_definition('odm', 'http://www.cdisc.org/ns/odm/v1.3')
    doc.root.add_namespace_definition('ds', 'http://www.w3.org/2000/09/xmldsig#')
    doc.root.add_namespace_definition('xsi', 'http://www.w3.org/2001/XMLSchema-instance')
    doc.root.add_namespace_definition('redcap', 'https://projectredcap.org')
    assert doc
    assert doc.at_xpath("/odm:ODM/odm:Study[@OID='Project.Test']")
  end
end
