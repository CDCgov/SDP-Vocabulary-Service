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

  test 'assign_new_oids' do
    prefix = ResponseSet.oid_prefix

    rs = ResponseSet.new
    rs.id = 3
    rs.save
    assert_equal 1, rs.version
    assert_equal 'RS-3', rs.version_independent_id
    assert_equal "#{prefix}.3", rs.oid

    rs = ResponseSet.new
    rs.oid = "#{prefix}.3"
    assert_not rs.valid?
    rs.oid = "#{prefix}.4"
    assert rs.valid?
    rs.save

    rs = ResponseSet.new
    rs.id = 4
    rs.oid = "#{prefix}.6"
    rs.save

    rs = ResponseSet.new
    rs.id = 5
    rs.oid = "#{prefix}.8"
    rs.save

    # Should rsind next available oid which is .7 NOT .9
    rs = ResponseSet.new
    rs.id = 6
    rs.save
    assert_equal "#{prefix}.7", rs.oid

    # Should rsollow special validation rules rsor new versions
    rs2 = ResponseSet.new
    rs2.version_independent_id = rs.version_independent_id
    rs2.version = 2
    rs2.save
    assert_equal rs.oid, rs2.oid

    rs3 = ResponseSet.new
    rs3.version_independent_id = rs.version_independent_id
    rs3.version = 3
    rs3.oid = rs.oid
    rs3.save
    assert_equal rs.oid, rs3.oid
  end
end
