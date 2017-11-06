require 'test_helper'

class CategoryTest < ActiveSupport::TestCase
  test 'should require a name' do
    type = Category.new
    assert_not type.valid?
  end

  test 'should have a name' do
    type = Category.new(name: 'Category')
    assert_equal type.name, 'Category'
  end
end
