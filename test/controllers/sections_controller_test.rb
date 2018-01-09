require 'test_helper'

class SectionsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers
  include ActiveJob::TestHelper
  include ActiveModelSerializers::Test::Schema

  DRAFT = 'draft'.freeze
  PUBLISHED = 'published'.freeze

  setup do
    @section = sections(:one)
    @question = questions(:one)
    @sq = section_questions(:one)
    @current_user = users(:admin)
    @na_user = users(:not_admin)
    @group = groups(:one)
    sign_in @current_user
  end

  test 'should get index' do
    get sections_url, xhr: true, params: nil
    assert_response :success
  end

  test 'revisions should increment version without needing a param' do
    section_json = { section: { name: @section.name, version_independent_id: 'SECT-1337' } }.to_json
    post sections_url, params: section_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    Section.last.publish(@current_user)
    v1 = Section.last
    section_json = { section: { name: 'A revised name', version_independent_id: 'SECT-1337' } }.to_json
    post sections_url, params: section_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    assert_response :success
    v2 = Section.last
    assert_equal v1.version_independent_id, v2.version_independent_id
    assert_equal v1.version + 1, v2.version
    assert_equal 'A revised name', v2.name
  end

  test 'cannot revise something you do not own' do
    section_json = { section: { name: @section.name, version_independent_id: 'SECT-1337' } }.to_json
    post sections_url, params: section_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    Section.last.publish(@current_user)
    sign_in users(:not_admin)
    section_json = { section: { name: 'A Failed revision', version_independent_id: 'SECT-1337' } }.to_json
    post sections_url, params: section_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    assert_response :unauthorized
  end

  test 'cannot edit tags on something you do not own' do
    section_json = { section: { name: @section.name, version_independent_id: 'SECT-1337' } }.to_json
    post sections_url, params: section_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    sign_in users(:not_admin)
    section_json = { concepts_attributes: [{ value: 'Tag2', display_name: 'TagName2', code_system: 'SNOMED' }, { value: 'Tag1', display_name: 'TagName1', code_system: 'SNOMED' }] }
    put update_tags_section_path(Section.last, format: :json, params: section_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' })
    assert_response :forbidden
  end

  test 'can edit tags on something you do own' do
    section_json = { section: { name: @section.name, version_independent_id: 'SECT-1337' } }.to_json
    post sections_url, params: section_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    section_json = { concepts_attributes: [{ value: 'Tag2', display_name: 'TagName2', code_system: 'SNOMED' }, { value: 'Tag1', display_name: 'TagName1', code_system: 'SNOMED' }] }
    put update_tags_section_path(Section.last, format: :json, params: section_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' })
    assert_response :success
  end

  test 'can edit tags on something you are in a group with' do
    section_json = { section: { name: @section.name, version_independent_id: 'SECT-1337' } }.to_json
    post sections_url, params: section_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    Section.last.add_to_group(@group.id)
    sign_in @na_user
    @group.add_user(@na_user)
    section_json = { concepts_attributes: [{ value: 'Tag2', display_name: 'TagName2', code_system: 'SNOMED' }, { value: 'Tag1', display_name: 'TagName1', code_system: 'SNOMED' }] }
    put update_tags_section_path(Section.last, format: :json, params: section_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' })
    assert_response :success
  end

  test 'cannot edit pdv on something you do not own' do
    sign_in @na_user
    pdv_json = { pdv: 'Test', sq_id: @sq.id }
    put update_pdv_section_path(@section, format: :json, params: pdv_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' })
    assert_response :unauthorized
  end

  test 'can revise something you share a group with' do
    section_json = { section: { name: @section.name, version_independent_id: 'SECT-1337' } }.to_json
    post sections_url, params: section_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    Section.last.publish(@current_user)
    Section.last.add_to_group(@group.id)
    sign_in @na_user
    @group.add_user(@na_user)
    section_json = { section: { name: 'A Successful revision', version_independent_id: 'SECT-1337' } }.to_json
    post sections_url, params: section_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    assert_response :success
  end

  test 'should add content to group' do
    post sections_url(format: :json), params: { section: { name: 'Testing.' } }
    put add_to_group_section_url(Section.last, format: :json), params: { group: @group.id }
    assert_response :success
  end

  test 'should not add content to group you arent a member of or dont own' do
    post sections_url(format: :json), params: { section: { name: 'Testing.' } }
    sign_in @na_user
    put add_to_group_section_url(Section.last, format: :json), params: { group: @group.id }
    assert_response 403
  end

  test 'cannot revise a draft' do
    section_json = { section: { name: @section.name, version_independent_id: 'SECT-1337' } }.to_json
    post sections_url, params: section_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    assert_equal DRAFT, Section.last.status
    section_json = { section: { name: 'A Failed revision', version_independent_id: 'SECT-1337' } }.to_json
    post sections_url, params: section_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    assert_response :unprocessable_entity
  end

  test 'should create section' do
    assert_enqueued_jobs 0

    assert_difference('Section.count') do
      section_json = { section: { name: 'Create test section', created_by_id: @section.created_by_id } }.to_json
      post sections_url, params: section_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    end
    assert_enqueued_jobs 1

    assert_response :success
  end

  test 'should update a section' do
    assert_enqueued_jobs 0

    draft_section = sections(:draft)

    section_json = { section: { name: draft_section.name, created_by_id: @section.created_by_id } }.to_json
    put section_url(draft_section), params: section_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }

    assert_enqueued_jobs 1

    assert_response :success
  end

  test 'should show section' do
    get section_url(@section), xhr: true, params: nil
    assert_response :success
  end

  test 'should not publish an already published section' do
    put publish_section_url(@section), xhr: true, params: nil
    assert_response :unprocessable_entity
  end

  test 'should publish a draft section' do
    put publish_section_url(sections(:draft)), xhr: true, params: nil
    assert_response :success
  end

  test 'should get export' do
    get export_section_url(@section)
    assert_response :success
  end

  test 'should get redcap export ' do
    get redcap_section_url(@section)
    assert response.headers['Content-Disposition'].index("filename=\"#{@section.name.underscore}_redcap.xml\"")
    validate_redcap(response.body)
    assert_response :success
  end

  test 'should destroy a draft section and sectionQuestions' do
    post questions_url(format: :json), params: { question: { status: 'draft', content: 'TBD content' } }
    last_id = Section.last.id
    linked_question = { question_id: Question.last.id, response_set_id: nil, position: 1, program_var: 'test' }
    post sections_url(format: :json), params: { section: { name: 'Create test section', created_by_id: @section.created_by_id, linked_questions: [linked_question] } }
    assert_difference('Question.count', 0) do
      assert_difference('SectionQuestion.count', -1) do
        assert_difference('Section.count', -1) do
          delete section_url(Section.last, format: :json)
        end
      end
    end
    assert_response :success
    assert_not_equal last_id, Section.last
  end

  test 'should respond to json format' do
    get section_url(@section, format: :json)
    assert_response :success
    assert_json_schema_response('sections/show_default.json')
  end

  test 'publishers should see sections from other authors' do
    sign_out @current_user
    @current_publisher = users(:publisher)
    sign_in @current_publisher
    get section_url(sections(:three), format: :json)
    assert_response :success
  end

  test 'publishers should be able to publish sections' do
    sign_out @current_user
    @current_publisher = users(:publisher)
    sign_in @current_publisher
    put publish_section_path(sections(:three), format: :json, params: { section: sections(:three) })
    assert_response :success
    assert_equal Section.find(sections(:three).id).status, PUBLISHED
    assert_equal Section.find(sections(:three).id).published_by.id, users(:publisher).id
  end

  test 'authors should not be able to publish sections' do
    put publish_section_path(sections(:three), format: :json, params: { section: sections(:three) })
    assert_response :forbidden
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
