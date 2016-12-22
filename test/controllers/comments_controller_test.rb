require 'test_helper'

class CommentsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  test 'can add comment to a commentable object ' do
    sign_in(users(:admin))
    q = questions(:one)
    assert_equal 0, q.comments.length
    post comments_path, params: { comment: { commentable_type: 'Question', commentable_id: q.id, comment: 'hey' } }
    assert_response :success
    q.reload
    assert_equal 1, q.comments.length
  end

  test 'can fetch comments by type and id ' do
    q = questions(:three)
    get comments_path, params: { commentable_type: 'Question', commentable_id: q.id }
    assert_response :success
  end
end
