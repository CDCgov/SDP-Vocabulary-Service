require 'test_helper'

class SurveyTest < ActiveSupport::TestCase
  test 'has survey forms' do
    s = surveys(:one)
    assert_equal 2, s.survey_forms.length
  end

  test 'same OMB control number is OK across versions' do
    s = surveys(:one)
    revision = s.build_new_revision
    assert_equal 2, revision.version
    assert revision.save
    assert_equal s.control_number, revision.control_number
  end

  test ' invalid control number should not be valid' do
    s = surveys(:one)
    s.control_number = '1234'
    assert_not s.valid?
  end
end
