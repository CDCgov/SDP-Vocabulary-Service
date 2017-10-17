require 'test_helper'

class SectionQuestionTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
  test 'A section question should save with a position' do
    sq = section_questions(:one)
    sq.position = 1
    assert sq.save
  end
end
