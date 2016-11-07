require 'test_helper'

class ResponseSetTest < ActiveSupport::TestCase
  test 'latest_versions' do
    assert_equal 2, ResponseSet.latest_versions.count
  end

  test 'build_new_revision' do
    rs = response_sets(:gfv2)
    revision = rs.build_new_revision
    assert_equal 3, revision.version
    assert_equal 2, revision.version_independent_id
    assert_equal 2, revision.responses.length
  end

  test 'other_versions' do
    rs = response_sets(:gfv2)
    other = rs.other_versions
    assert_equal 1, other.length
  end
end
