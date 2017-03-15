require 'test_helper'

class FormQuestionTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
  test 'A form question should save with a position' do
    fq = form_questions(:one)
    fq.position = 1
    assert fq.save
  end
end
