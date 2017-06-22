require 'test_helper'

class UpdateIndexJobJobTest < ActiveJob::TestCase
  test 'job calls update index' do
    form = forms(:one)
    UpdateIndexJob.perform_now('form', form)
    req = FakeWeb.last_request
    assert_equal 'POST', req.method
    assert_equal "/vocabulary/form/#{form.id}/_update", req.path
  end

  test 'job calls create index' do
    form = forms(:two)
    FakeWeb.register_uri(:head, "http://example.com:9200/vocabulary/form/#{form.id}", status: ['404', 'Not Found'])
    UpdateIndexJob.perform_now('form', form)
    req = FakeWeb.last_request
    assert_equal 'PUT', req.method
    assert_equal "/vocabulary/form/#{form.id}?op_type=create", req.path
  end
end
