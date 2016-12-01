require 'test_helper'

class ResponseTypeTest < ActiveSupport::TestCase
  test 'should require a name' do
    type = ResponseType.new
    assert_not type.valid?
  end

  test 'should save with a name' do
    type = ResponseType.new(name: 'ResponseType')
    assert type.valid?
    assert type.save, 'Should have saved to database'
  end

  test 'should require name uniqueness ' do
    type = ResponseType.new(name: 'ResponseType')
    assert type.valid?
    assert type.save, 'Should have saved to database'

    type2 = ResponseType.new(name: 'ResponseType')
    assert_not type2.valid?
  end

  test 'should have a name' do
    type = ResponseType.new(name: 'QuestionType')
    assert_equal type.name, 'QuestionType'
  end
end
