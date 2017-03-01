require 'test_helper'

class ResponseSetTest < ActiveSupport::TestCase
  setup do
    @user = users(:admin)
  end

  test 'validates name' do
    rs = ResponseSet.new(name: 'Test Set', created_by: @user)
    assert rs.valid?, 'Response set should be valid with a name'

    rs = ResponseSet.new(created_by: @user)
    assert !rs.valid?, 'Response set should not be valid without a name'
  end

  test 'validates created_by' do
    rs = ResponseSet.new(name: 'Test Set',  created_by: @user)
    assert rs.valid?, 'Response set should be valid with a created_by user'

    rs = ResponseSet.new(name: 'Test Set')
    assert !rs.valid?, 'Response set should not be valid without a created_by user'
  end

  test 'validates  source' do
    rs = ResponseSet.new(name: 'Test Set',  created_by: @user)
    assert rs.valid?
    assert_equal 'local', rs.source, 'default source attribute should be local'

    rs.source = 'PHIN_VADS'
    assert rs.valid?, 'response set should be valid with PHIN_VADS as source '

    rs.source = nil
    assert !rs.valid?, 'Response set should not be valid with nil source '

    rs.source = 'NLM VSAC'
    assert !rs.valid?, 'Response set should not be valid with source something other than local or PHIN_VADS'
  end

  test 'latest_versions' do
    assert_equal 2, ResponseSet.latest_versions.count
  end

  test 'build_new_revision' do
    rs = response_sets(:gfv2)
    revision = rs.build_new_revision
    assert_equal rs.version + 1, revision.version
    assert_equal rs.version_independent_id, revision.version_independent_id
    assert_equal rs.responses.length, revision.responses.length
  end

  test 'other_versions' do
    rs = response_sets(:gfv2)
    other = rs.other_versions
    assert_equal 1, other.length
  end

  test 'assigns a version_independent_id when saved the first time' do
    rs = ResponseSet.new(name: 'Test Set', version: 1, created_by: @user)
    assert rs.save!
    assert_equal "RS-#{rs.id}", rs.version_independent_id
  end

  test 'does not let you create a record at a version other than one' do
    rs = ResponseSet.new(name: 'Test Set', version: 2, created_by: @user)
    assert_raise ActiveRecord::RecordInvalid do
      rs.save!
    end
  end

  test 'assign_new_oids' do
    prefix = ResponseSet.oid_prefix

    rs = ResponseSet.new(name: 'Test', created_by: @user)
    rs.id = 3

    assert rs.save
    assert_equal 1, rs.version
    assert_equal 'RS-3', rs.version_independent_id
    assert_equal "#{prefix}.3", rs.oid

    rs = ResponseSet.new(name: 'Test', created_by: @user)
    rs.oid = "#{prefix}.3"
    assert_not rs.valid?
    rs.oid = "#{prefix}.4"
    assert rs.valid?
    rs.save

    rs = ResponseSet.new(name: 'Test', created_by: @user)
    rs.id = 4
    rs.oid = "#{prefix}.6"
    rs.save

    rs = ResponseSet.new(name: 'Test', created_by: @user)
    rs.id = 5
    rs.oid = "#{prefix}.8"
    asssert rs.save

    # Should find next available oid which is .7 NOT .9
    rs = ResponseSet.new(name: 'Test', created_by: @user)
    rs.id = 6
    assert rs.save
    assert_equal "#{prefix}.7", rs.oid

    # Should follow special validation rules for new versions
    rs2 = ResponseSet.new(name: 'Test', created_by: @user)
    rs2.version_independent_id = rs.version_independent_id
    rs2.version = 2
    rs2.save
    assert_equal rs.oid, rs2.oid

    rs3 = ResponseSet.new(name: 'Test', created_by: @user)
    rs3.version_independent_id = rs.version_independent_id
    rs3.version = 3
    rs3.oid = rs.oid
    assert rs3.save
    assert_equal rs.oid, rs3.oid
  end
end
