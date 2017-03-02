require 'test_helper'

class CommentsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  test 'can add comment to a commentable object ' do
    sign_in(users(:admin))
    q = questions(:one)
    assert_difference('q.comments.length') do
      post comments_path, params: { comment: { commentable_type: 'Question', commentable_id: q.id, comment: 'hey' } }
      assert_response :success
      q.reload
    end
  end

  test 'can fetch comments by type and id ' do
    q = questions(:three)
    get comments_path, params: { commentableType: 'Question', commentableId: q.id }
    assert_response :success
  end
end
