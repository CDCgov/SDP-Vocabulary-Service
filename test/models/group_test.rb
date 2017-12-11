require 'test_helper'

class GroupTest < ActiveSupport::TestCase
  setup do
    @admin = users(:admin)
    @notadmin = users(:not_admin)
    @g = groups(:one)
  end

  test 'Group requires a name to be unique' do
    group = Group.new(name: 'Group1')
    assert_not group.valid?
  end

  test 'Can add a user' do
    assert_difference('@g.users.count') do
      @g.add_user(@notadmin)
    end
  end

  test 'Can remove a user' do
    assert_difference('@g.users.count', -1) do
      @g.remove_user(@admin)
    end
  end
end
