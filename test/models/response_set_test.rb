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

  test 'validates source' do
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
    user = users(:admin)
    rs1 = ResponseSet.new(name: 'Test Response Set', created_by: user)
    assert_equal DRAFT, rs1.status
    rs1.publish(user)
    assert_equal user, rs1.published_by
    assert_equal PUBLISHED, rs1.status
  end

  test 'latest_versions' do
    assert_equal 7, ResponseSet.latest_versions.count
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

  test 'surveillance_systems' do
    rs = response_sets(:one)
    ss = rs.surveillance_systems
    assert_equal 2, ss.length
    assert_includes ss.map(&:name), 'National Insignificant Digits System'
    assert_includes ss.map(&:name), 'National Spork Monitoring System'
  end

  test 'surveillance_programs' do
    rs = response_sets(:one)
    sp = rs.surveillance_programs
    assert_equal 1, sp.length
    assert_includes sp.map(&:name), 'Generic Surveillance Program'
  end
end
