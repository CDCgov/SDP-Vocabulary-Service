require 'test_helper'

module Users
  class OmniauthCallbacksControllerTest < ActionDispatch::IntegrationTest
    include Devise::Test::IntegrationHelpers
    include Rails.application.routes.url_helpers
    setup do
      OmniAuth.config.test_mode = true
      OmniAuth.config.mock_auth[:openid_connect] = OmniAuth::AuthHash.new(provider: 'openid_connect',
                                                                          uid: '12345',
                                                                          info: { email: 'admin@example.com' })

      @admin = User.find_by(email: 'admin@example.com')
      @user_count = User.count
    end

    test 'should create new user and authentication if one does not exist' do
      Question.destroy_all
      Form.destroy_all
      ResponseSet.destroy_all
      SurveyForm.destroy_all
      Survey.destroy_all
      User.destroy_all

      get '/users/auth/openid_connect/callback'
      assert_equal 1, User.count, 'expected a new user to have been created'
      user = User.first
      assert_equal 1, user.authentications.count, 'expected the new user to be associated with a single authentication'
      assert_equal 'admin@example.com', user.email
      assert_authentication(user.authentications[0], 'openid_connect', '12345')
      assert_response :redirect
      assert_redirected_to root_url
    end

    test 'should add and authentication to existing signed in user if one does not exist' do
      sign_in @admin
      auth_count = @admin.authentications.count
      get '/users/auth/openid_connect/callback'
      @admin.reload
      assert_equal User.count, @user_count, 'expected a new user to not have been created'
      assert_equal auth_count + 1, @admin.authentications.count, 'expected the new user to be associated with a new authentication'
      assert_authentication(@admin.authentications[0], 'openid_connect', '12345')
      assert_response :redirect
      assert_redirected_to authentications_url
      sign_out @admin
    end

    test 'should sign in user if an authentication from the the given provider exists' do
      @admin.authentications.create!(provider: 'openid_connect', uid: '12345')
      auth_count = @admin.authentications.count
      get '/users/auth/openid_connect/callback'
      @admin.reload
      assert_equal User.count, @user_count, 'expected a new user to not have been created'
      assert_equal auth_count, @admin.authentications.count, 'expected the new user not to have a new authentication'
      assert_authentication(@admin.authentications[0], 'openid_connect', '12345')
      assert_response :redirect
      assert_redirected_to root_url
    end

    test 'redirect user to sign in page' do
      auth_count = @admin.authentications.count
      get '/users/auth/openid_connect/callback'
      @admin.reload
      assert_equal User.count, @user_count, 'expected a new user to not have been created'
      assert_equal auth_count, @admin.authentications.count, 'expected user not to have any new authentications'
      assert_response :redirect
      assert_redirected_to new_user_registration_url
    end

    def assert_authentication(auth, provider, uid)
      assert_equal provider, auth.provider
      assert_equal uid, auth.uid
    end
  end
end
