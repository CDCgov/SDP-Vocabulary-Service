require 'test_helper'

class GroupsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @not_admin = users(:not_admin)
    @admin = users(:admin)
    @admin.add_role :admin
    @admin.save!
  end

  test 'should create group' do
    sign_in @admin
    create_json = { group: { name: 'Test Group', description: 'Group create test' } }.to_json
    post admin_groups_url, params: create_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    assert Group.find_by(name: 'Test Group')
  end

  test 'should add user' do
    sign_in @admin
    assert Group.find_by(name: 'Group1').users.length == 1
    add_json = { email: 'not_admin@example.com', group: 'Group1' }.to_json
    put admin_add_user_url, params: add_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    assert Group.find_by(name: 'Group1').users.length == 2
  end

  test 'should remove user' do
    sign_in @admin
    assert Group.find_by(name: 'Group1').users.length == 1
    remove_json = { email: 'admin@example.com', group: 'Group1' }.to_json
    put admin_remove_user_url, params: remove_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    assert_equal Group.find_by(name: 'Group1').users.length, 0
  end

  test 'should not find user' do
    sign_in @admin
    remove_json = { email: 'fake_not_real@example.com', group: 'Group1' }.to_json
    put admin_remove_user_url, params: remove_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    assert_response :unprocessable_entity
  end

  test 'should get denied' do
    sign_in @not_admin
    create_json = { group: { name: 'Test Group', description: 'Group create test' } }.to_json
    post admin_groups_url, params: create_json, headers: { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' }
    assert_response :unauthorized
  end
end
