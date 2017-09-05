require 'test_helper'

class DeleteFromIndexJobTest < ActiveJob::TestCase
  # test "the truth" do
  #   assert true
  # end
  test 'job calls delete index' do
    DeleteFromIndexJob.perform_now('form', 1)
    req = FakeWeb.last_request
    assert_equal 'DELETE', req.method
    assert_equal '/vocabulary/form/1?refresh=false', req.path
  end
end
