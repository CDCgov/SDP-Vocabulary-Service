require 'test_helper'

class ResponseSetTest < ActiveSupport::TestCase
  test 'latest_versions' do
    assert_equal 2, ResponseSet.latest_versions.count
  end
end
