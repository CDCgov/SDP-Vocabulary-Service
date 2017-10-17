require 'test_helper'

class SurveySectionTest < ActiveSupport::TestCase
  test 'has sections' do
    s = survey_sections(:one)
    assert_equal sections(:one).id, s.section.id
  end
end
