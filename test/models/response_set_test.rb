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

  test 'link to duplicate' do
    rs = response_sets(:search_1)
    rs2 = response_sets(:three)
    assert_not_equal rs.content_stage, 'Duplicate'
    assert_equal rs.duplicates_replaced_count, 0
    assert_not_equal rs.duplicate_of, rs2.id
    rs.link_to_duplicate(rs2.id)
    assert rs.save!
    assert_equal rs.content_stage, 'Duplicate'
    assert_equal rs.duplicates_replaced_count, 1
    assert_equal rs.duplicate_of, rs2.id
  end

  test 'mark as duplicate' do
    user = users(:admin)
    rs = ResponseSet.new(name: 'Test rs', created_by: user)
    assert rs.save
    replacement_rs = ResponseSet.new(name: 'Replace rs', created_by: user)
    replacement_rs.save
    new_replacement_rs = ResponseSet.new(name: 'New replace rs', created_by: user)
    new_replacement_rs.save
    rt = ResponseType.new(name: 'choice', code: 'choice')
    assert rt.save
    q = Question.new(content: 'Test q1', response_type: rt, created_by: user)
    assert q.save
    sect = Section.new(name: 'Test sect', created_by: user)
    sect.section_nested_items = [SectionNestedItem.new(question_id: q.id, response_set_id: rs.id, position: 0)]
    assert sect.save
    assert sect.response_sets.include?(rs)
    refute sect.response_sets.include?(replacement_rs)
    assert_equal replacement_rs.duplicates_replaced_count, 0
    rs.mark_as_duplicate(replacement_rs)
    refute sect.response_sets.include?(rs)
    assert sect.response_sets.include?(replacement_rs)
    assert_equal replacement_rs.duplicates_replaced_count, 1
    # This second mark as dupe checks that the later replacement inherits the replaced count and increments again
    replacement_rs.mark_as_duplicate(new_replacement_rs)
    refute sect.response_sets.include?(replacement_rs)
    assert sect.response_sets.include?(new_replacement_rs)
    assert_equal new_replacement_rs.duplicates_replaced_count, 2
  end

  test 'most_recent_for_oid' do
    rs = ResponseSet.most_recent_for_oid('5.6.7.8')
    assert rs
    assert_equal 2, rs.version

    rs = ResponseSet.most_recent_for_oid('6.7.8.9')
    assert_nil rs
  end
end
