require 'test_helper'

class FormTest < ActiveSupport::TestCase
  # Essentially testing that Versionable is working in Form
  test 'build_new_revision' do
    rs = forms(:one)
    revision = rs.build_new_revision
    assert_equal 2, revision.version
    assert_equal 'F-1', revision.version_independent_id
  end
end
