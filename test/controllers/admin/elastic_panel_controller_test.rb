require 'test_helper'

class AdminElasticPanelControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @not_admin = users(:not_admin)
    @publisher = users(:publisher)
    @admin = users(:admin)
    @admin.add_role :admin
    @admin.save!
  end

  test 'should be able to sync' do
    sign_in @admin
    put admin_es_sync_url, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    assert_response :ok
  end

  test 'should get denied' do
    sign_in @not_admin
    put admin_es_sync_url, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    assert_response :unauthorized
  end
end
