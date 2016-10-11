require 'test_helper'

class QuestionTypeTest < ActiveSupport::TestCase
  test 'should require a name' do
    type = QuestionType.new
    assert_not type.valid?
  end

  test 'should have a name' do
    type = QuestionType.new(name: 'QuestionType')
    assert_equal type.name, 'QuestionType'
  end
end
