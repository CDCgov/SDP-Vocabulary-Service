require 'test_helper'

class ConceptsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @question = questions(:one)
    @concept  = concepts(:one)
    sign_in users(:admin)
  end

  test 'should get index' do
    get concepts_url
    assert_response :success
  end
end
