require 'test_helper'
require 'sdp/importers/cdc'

class CDCTest < ActiveSupport::TestCase
  TEST_PROGRAM_COUNT = 3

  test 'import_programs' do
    initial_program_count = SurveillanceProgram.count
    SDP::Importers::CDC.import_programs('./test/fixtures/files/surveillance_programs.csv')
    assert_equal initial_program_count + TEST_PROGRAM_COUNT, SurveillanceProgram.count

    food_net = SurveillanceProgram.find_by(name: 'FoodNet')
    assert_equal 'FN', food_net.acronym
  end
end
