require 'test_helper'
require 'sdp/simple_search'

class SimpleSearchTest < ActiveSupport::TestCase
  setup do
    @admin = users(:admin)
    @user = users(:not_admin)
  end

  test 'can scope search to questions' do
    results = SDP::SimpleSearch.search('question', 'What is')
  end

  test 'can scope search to forms' do
    results = SDP::SimpleSearch.search('form', 'What is')
  end

  test 'can scope search to response sets ' do
    results = SDP::SimpleSearch.search('response_set', 'What is')
  end

  test 'can filter questions by user ' do
    results = SDP::SimpleSearch.search('question', 'What is ', @user.id)
  end

  test 'can filter forms by user ' do
    results = SDP::SimpleSearch.search('form', 'What is ', @user.id)
  end

  test 'can filter response_sets by user ' do
    results = SDP::SimpleSearch.search('response_set', 'What is ', @user.id)
  end

  test 'can search all types' do
    results = SDP::SimpleSearch.search(nil, 'What is ')
  end

  test 'can search all types filtered by user ' do
    results = SDP::SimpleSearch.search(nil, 'What is ', @user.id)
  end
end
