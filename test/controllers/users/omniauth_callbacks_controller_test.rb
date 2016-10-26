require 'test_helper'

class Users
  class OmniauthCallbacksControllerTest < ActionDispatch::IntegrationTest
    include Devise::Test::IntegrationHelpers

    test 'should create new user and authentication if one does not exist' do
      omni = { provider: 'test', uid: 'test_uid' }
      get '/users/auth/openid_connect/callback', {}, omni
      assert_response :success
    end

    test 'should add and authentication to existing user if one does not exist' do
      raise
    end

    test 'should sign in user if an authentication from the the given provider exists' do
      raise
    end
  end
end
