require 'test_helper'

class ResponseSetTest < ActiveSupport::TestCase
  DRAFT = 'draft'.freeze
  PUBLISHED = 'published'.freeze

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

  test 'publish' do
    rs1 = ResponseSet.new
    assert_equal DRAFT, rs1.status
    rs1.publish
    assert_equal PUBLISHED, rs1.status
  end

  test 'latest_versions' do
    assert_equal 6, ResponseSet.latest_versions.count
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

    rs1 = ResponseSet.new(name: 'Test', created_by: @user)
    assert rs1.save
    assert_equal 1, rs1.version
    assert_equal "RS-#{rs1.id}", rs1.version_independent_id
    assert_equal "#{prefix}.#{rs1.id}", rs1.oid

    rs2 = ResponseSet.new(name: 'Test', created_by: @user)
    rs2.oid = "#{prefix}.#{rs1.id}"
    assert_not rs2.valid?
    rs2.oid = "#{prefix}.#{rs1.id + 1}"
    assert rs2.valid?
    assert rs2.save

    rs3 = ResponseSet.new(name: 'Test', created_by: @user)
    rs3.oid = "#{prefix}.#{rs1.id + 3}"
    assert rs3.save

    rs4 = ResponseSet.new(name: 'Test', created_by: @user)
    rs4.oid = "#{prefix}.#{rs1.id + 5}"
    assert rs4.save

    # Should find next available oid which is rs1.id+4 NOT rs1.id+6
    rs5 = ResponseSet.new(name: 'Test', created_by: @user)
    assert rs5.save
    assert_equal "#{prefix}.#{rs1.id + 4}", rs5.oid

    # Should follow special validation rules for new versions
    rs6 = ResponseSet.new(name: 'Test', created_by: @user)
    rs6.version_independent_id = rs1.version_independent_id
    rs6.version = rs1.version + 1
    assert rs6.save
    assert_equal rs1.oid, rs6.oid

    rs7 = ResponseSet.new(name: 'Test', created_by: @user)
    rs7.version_independent_id = rs1.version_independent_id
    rs7.version = rs1.version + 2
    rs7.oid = rs1.oid
    assert rs7.save
    assert_equal rs1.oid, rs7.oid
  end

  test 'surveillance_systems' do
    rs = response_sets(:one)
    ss = rs.surveillance_systems
    assert_equal 'National Insignificant Digits System', ss.first.name
  end

  test 'surveillance_programs' do
    rs = response_sets(:one)
    sp = rs.surveillance_programs
    assert_equal 'Generic Surveillance Program', sp.first.name
  end
end
