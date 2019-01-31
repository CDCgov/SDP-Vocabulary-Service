require 'test_helper'

class UpdateIndexJobJobTest < ActiveJob::TestCase
  test 'job calls update index' do
    section = sections(:one)
    UpdateIndexJob.perform_now('section', section)
    req = FakeWeb.last_request
    assert_equal 'POST', req.method
    assert_equal "/vocabulary/section/#{section.id}/_update?retry_on_conflict=5", req.path
  end

  test 'job calls create index' do
    section = sections(:two)
    FakeWeb.register_uri(:head, "http://example.com:9200/vocabulary/section/#{section.id}", status: ['404', 'Not Found'])
    UpdateIndexJob.perform_now('section', section)
    req = FakeWeb.last_request
    assert_equal 'PUT', req.method
    assert_equal "/vocabulary/section/#{section.id}?op_type=create", req.path
  end
end
