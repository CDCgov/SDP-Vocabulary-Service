require 'test_helper'

class FormTest < ActiveSupport::TestCase
  # Essentially testing that Versionable is working in Form
  test 'build_new_revisions' do
    rs = forms(:one)
    revision = rs.build_new_revision
    assert_equal 2, revision.version
    assert_equal 'F-1', revision.version_independent_id
    assert_equal '2.16.840.1.113883.3.1502.1.1', revision.oid

    rs = forms(:two)
    revision = rs.build_new_revision
    assert_equal 2, revision.version
    assert_equal 'F-2', revision.version_independent_id
    assert_equal nil, revision.oid
  end

  test 'assign_new_oids' do
    f = Form.new
    f.id = 3
    f.save
    assert_equal 1, f.version
    assert_equal 'F-3', f.version_independent_id
    assert_equal '2.16.840.1.113883.3.1502.1.3', f.oid

    f = Form.new
    f.oid = '2.16.840.1.113883.3.1502.1.3'
    assert_not f.valid?
    f.oid = '2.16.840.1.113883.3.1502.1.4'
    assert f.valid?
    f.save

    f = Form.new
    f.id = 4
    f.oid = '2.16.840.1.113883.3.1502.1.6'
    f.save

    f = Form.new
    f.id = 5
    f.oid = '2.16.840.1.113883.3.1502.1.8'
    f.save

    # Should find next available oid which is .7 NOT .9
    f = Form.new
    f.id = 6
    f.save
    assert_equal '2.16.840.1.113883.3.1502.1.7', f.oid

    # Should follow special validation rules for new versions
    f2 = Form.new
    f2.version_independent_id = f.version_independent_id
    f2.version = 2
    f2.save
    assert_equal f.oid, f2.oid

    f3 = Form.new
    f3.version_independent_id = f.version_independent_id
    f3.version = 3
    f3.oid = f.oid
    f3.save
    assert_equal f.oid, f3.oid
  end

  test 'make sure the OMB control number is unique' do
    f = Form.new(name: 'Doubly Double', control_number: '1234-5678')
    did_save = f.save
    assert_not did_save
  end

  test 'same OMB control number is OK across versions' do
    f = forms(:one)
    revision = f.build_new_revision
    assert_equal 2, revision.version
    did_save = revision.save
    assert did_save
    assert_equal '1234-5678', revision.control_number
  end
end
