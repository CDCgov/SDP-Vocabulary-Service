require 'test_helper'

class SectionNestedItemTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
  test 'A section nested item should save with a position' do
    sni = section_nested_items(:one)
    sni.position = 1
    assert sni.save
  end
end
