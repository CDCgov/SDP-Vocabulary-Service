require 'test_helper'

class FormTest < ActiveSupport::TestCase
  # Essentially testing that Versionable is working in Form
  test 'build_new_revision' do
    rs = forms(:one)
    revision = rs.build_new_revision
    assert_equal 2, revision.version
    assert_equal 'F-1', revision.version_independent_id
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
