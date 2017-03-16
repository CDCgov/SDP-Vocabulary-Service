require 'test_helper'

class SurveyFormTest < ActiveSupport::TestCase
  test 'has forms' do
    s = survey_forms(:one)
    assert_equal forms(:one).id, s.form.id
  end
end
