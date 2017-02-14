require 'test_helper'

class UpdateIndexJobJobTest < ActiveJob::TestCase
  # test "the truth" do
  #   assert true
  # end
  test 'job calls update index' do
    UpdateIndexJob.perform_now('form', id: 1)
    req = FakeWeb.last_request
    assert_equal 'POST', req.method
    assert_equal '/vocabulary/form/1/_update', req.path
  end

  test 'job calls create index' do
    UpdateIndexJob.perform_now('form', id: 2)
    req = FakeWeb.last_request
    assert_equal 'PUT', req.method
    assert_equal '/vocabulary/form/2?op_type=create', req.path
  end
end
