require 'test_helper'

class ResponseSetTest < ActiveSupport::TestCase
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
    rs = ResponseSet.new(name: 'Test Set', version: 1)
    assert rs.save!
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

    rs1 = ResponseSet.new
    assert rs1.save
    assert_equal 1, rs1.version
    assert_equal "RS-#{rs1.id}", rs1.version_independent_id
    assert_equal "#{prefix}.#{rs1.id}", rs1.oid

    rs2 = ResponseSet.new
    rs2.oid = "#{prefix}.#{rs1.id}"
    assert_not rs2.valid?
    rs2.oid = "#{prefix}.#{rs1.id + 1}"
    assert rs2.valid?
    assert rs2.save

    rs3 = ResponseSet.new
    rs3.oid = "#{prefix}.#{rs1.id + 3}"
    assert rs3.save

    rs4 = ResponseSet.new
    rs4.oid = "#{prefix}.#{rs1.id + 5}"
    assert rs4.save

    # Should find next available oid which is rs1.id+4 NOT rs1.id+6
    rs5 = ResponseSet.new
    assert rs5.save
    assert_equal "#{prefix}.#{rs1.id + 4}", rs5.oid

    # Should follow special validation rules for new versions
    rs6 = ResponseSet.new
    rs6.version_independent_id = rs1.version_independent_id
    rs6.version = rs1.version + 1
    assert rs6.save
    assert_equal rs1.oid, rs6.oid

    rs7 = ResponseSet.new
    rs7.version_independent_id = rs1.version_independent_id
    rs7.version = rs1.version + 2
    rs7.oid = rs1.oid
    assert rs7.save
    assert_equal rs1.oid, rs7.oid
  end
end
