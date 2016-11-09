require 'test_helper'

class ResponseSetTest < ActiveSupport::TestCase
  test 'latest_versions' do
    assert_equal 2, ResponseSet.latest_versions.count
  end

  test 'build_new_revision' do
    rs = response_sets(:gfv2)
    revision = rs.build_new_revision
    assert_equal 3, revision.version
    assert_equal 'RS-2', revision.version_independent_id
    assert_equal 2, revision.responses.length
  end

  test 'other_versions' do
    rs = response_sets(:gfv2)
    other = rs.other_versions
    assert_equal 1, other.length
  end

  test 'assigns a version_independent_id when saved the first time' do
    rs = ResponseSet.new(name: 'Test Set', version: 1)
    rs.save!
    assert_equal "RS-#{rs.id}", rs.version_independent_id
  end

  test 'does not let you create a record at a version other than one' do
    rs = ResponseSet.new(name: 'Test Set', version: 2)
    assert_raise ActiveRecord::RecordInvalid do
      rs.save!
    end
  end
end
