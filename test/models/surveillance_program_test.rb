require 'test_helper'

class SurveillanceProgramTest < ActiveSupport::TestCase
  test 'should be unique by name' do
    sp1 = SurveillanceProgram.new(name: 'Test Program')
    assert sp1.save
    sp2 = SurveillanceProgram.new(name: 'Test Program')
    assert_raise do
      sp2.save
    end
  end
end
