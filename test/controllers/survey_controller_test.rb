require 'test_helper'

class SurveysControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers
  include ActiveJob::TestHelper

  DRAFT = 'draft'.freeze
  PUBLISHED = 'published'.freeze

  setup do
    @current_user = users(:not_admin)
    @survey = surveys(:four)
    sign_in @current_user
  end

  test 'should get index' do
    get surveys_url
    assert_response :success
  end

  test 'should get new' do
    get new_survey_url
    assert_response :success
  end

  test 'should create survey' do
    assert_enqueued_jobs 0
    assert_difference('Survey.count') do
      post surveys_url params: { survey: { linked_forms: [{ form_id: forms(:one).id, position: 0 }], name: 'Test' } }
    end
    assert_enqueued_jobs 5 # 1 for the survey, 1 for the form update, 2 for questions, 1 for response set
    assert_response :success
    assert_equal 1, Survey.last.forms.length
    assert_equal 'GSP', Survey.last.surveillance_program.acronym
  end

  test 'should show survey' do
    get survey_url(@survey)
    assert_response :success
  end

  test 'should destroy survey and surveyforms' do
    assert_enqueued_jobs 0
    post forms_url(format: :json), params: { form: { name: 'Create test form', created_by_id: @survey.created_by_id, linked_questions: [nil], linked_response_sets: [nil] } }
    post surveys_url(format: :json), params: { survey: { name: 'Create test survey', created_by_id: @survey.created_by_id, linked_forms: [{ form_id: Form.last.id, position: 0 }] } }
    assert_difference('Survey.count', -1) do
      assert_difference('SurveyForm.count', -1) do
        assert_difference('Form.count', 0) do
          delete survey_url(Survey.last)
        end
      end
    end
    assert_enqueued_jobs 4
  end

  test 'should not publish a published survey' do
    sign_out @current_user
    @current_publisher = users(:publisher)
    sign_in @current_publisher
    @survey = surveys(:two)
    put publish_survey_url(@survey)
    assert_response :unprocessable_entity
  end

  test 'publishers should see surveys from other authors' do
    sign_out @current_user
    @current_publisher = users(:publisher)
    sign_in @current_publisher
    get survey_url(surveys(:four), format: :json)
    assert_response :success
  end

  test 'publishers should be able to publish surveys' do
    sign_out @current_user
    @current_publisher = users(:publisher)
    sign_in @current_publisher
    put publish_survey_path(surveys(:four), format: :json, params: { survey: surveys(:four) })
    assert_response :success
    assert_equal Survey.find(surveys(:four).id).status, PUBLISHED
    assert_equal Survey.find(surveys(:four).id).published_by.id, users(:publisher).id
  end

  test 'authors should not be able to publish surveys' do
    put publish_survey_path(surveys(:four), format: :json, params: { survey: surveys(:four) })
    assert_response :forbidden
  end

  test 'should get redcap export ' do
    get redcap_survey_url(@survey)
    assert response.headers['Content-Disposition'].index("filename=\"#{@survey.name.underscore}_redcap.xml\"")
    validate_redcap(response.body)
    assert_response :success
  end

  def validate_redcap(xml)
    doc = Nokogiri::XML::Document.parse(xml)
    doc.root.add_namespace_definition('odm', 'http://www.cdisc.org/ns/odm/v1.3')
    doc.root.add_namespace_definition('ds', 'http://www.w3.org/2000/09/xmldsig#')
    doc.root.add_namespace_definition('xsi', 'http://www.w3.org/2001/XMLSchema-instance')
    doc.root.add_namespace_definition('redcap', 'https://projectredcap.org')
    question_count = @survey.survey_forms.collect { |sf| sf.form.form_questions.count }.sum
    assert doc
    assert doc.xpath('//odm:FormDef').length == @survey.survey_forms.length
    assert doc.xpath('//odm:ItemGroupDef').length == @survey.survey_forms.length
    assert doc.xpath('//odm:ItemDef').length == question_count
    assert doc.xpath('//odm:ItemRef').length == question_count
  end
end
