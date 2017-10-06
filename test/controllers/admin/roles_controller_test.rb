require 'test_helper'

class AdminRolesControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @not_admin = users(:not_admin)
    @publisher = users(:publisher)
    @admin = users(:admin)
    @admin.add_role :admin
    @admin.save!
  end

  test 'should grant and revoke admin' do
    sign_in @admin
    grant_json = { email: 'not_admin@example.com' }.to_json
    put admin_grant_admin_url, params: grant_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    assert @not_admin.has_role?(:admin)
    revoke_json = { admin_id: @not_admin.id }.to_json
    put admin_revoke_admin_url, params: revoke_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    assert !@not_admin.has_role?(:admin)
  end

  test 'should grant and revoke publisher' do
    sign_in @admin
    grant_json = { email: 'publisher@example.com' }.to_json
    put admin_grant_publisher_url, params: grant_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    assert @publisher.has_role?(:publisher)
    revoke_json = { pub_id: @publisher.id }.to_json
    put admin_revoke_publisher_url, params: revoke_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    assert !@publisher.has_role?(:publisher)
  end

  test 'should reject bad email' do
    sign_in @admin
    grant_json = { email: 'bad_email@example.blah' }.to_json
    put admin_grant_admin_url, params: grant_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    assert_response :unprocessable_entity
  end

  test 'should get denied' do
    sign_in @not_admin
    grant_json = { email: 'publisher@example.com' }.to_json
    put admin_grant_admin_url, params: grant_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    assert_response :unauthorized
  end
end
