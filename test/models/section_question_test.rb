require 'test_helper'

class SectionQuestionTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
  test 'A section question should save with a position' do
    fq = section_questions(:one)
    fq.position = 1
    assert fq.save
  end
end
