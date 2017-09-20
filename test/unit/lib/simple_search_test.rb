require 'test_helper'
require 'sdp/simple_search'

class SimpleSearchTest < ActiveSupport::TestCase
  setup do
    @admin = users(:admin)
    @publisher = users(:publisher)
    @publisher.add_role :publisher
    @user = users(:not_admin)
  end

  test 'can scope search by type ' do
    %w(question form response_set survey).each do |type|
      results = SDP::SimpleSearch.search(type, 'Search')
      json = JSON.parse(results.target!)
      # there is only 1 search related fixture for each type that is published
      # with the text  "Search" in the search fields
      assert_equal 1, json['hits']['total']
      assert_equal 1, json['hits']['hits'].length
      json['hits']['hits'].each do |hit|
        assert_equal type, hit['_type']
      end
    end
  end

  test 'can filter searches by user ' do
    %w(question form response_set survey).each do |type|
      admin_results = SDP::SimpleSearch.search(type, 'Search', @admin.id)
      admin_json = JSON.parse(admin_results.target!)
      user_results = SDP::SimpleSearch.search(type, 'Search', @user.id)
      user_json = JSON.parse(user_results.target!)
      # there is only 1 search related fixture for each type that is published
      # with the text  "Search" in the search fields
      assert_equal 2, admin_json['hits']['total']
      assert_equal 2, admin_json['hits']['hits'].length
      admin_json['hits']['hits'].each do |hit|
        assert_equal type, hit['_type']
        source = hit['_source']
        assert source['createdBy']['id'] == @admin.id || source['status'] == 'published'
      end

      assert_equal 2, user_json['hits']['total']
      assert_equal 2, user_json['hits']['hits'].length
      user_json['hits']['hits'].each do |hit|
        assert_equal type, hit['_type']
        source = hit['_source']
        assert source['createdBy']['id'] == @user.id || source['status'] == 'published'
      end
    end
  end

  test 'can search all types' do
    results = SDP::SimpleSearch.search(nil, 'Search')
    json = JSON.parse(results.target!)
    # there is only 1 search related fixture for each type that is published
    # with the text  "Search" in the search fields so this should be 3
    assert_equal 4, json['hits']['total']
    assert_equal 4, json['hits']['hits'].length
    hit_types = { 'form' => 0, 'question' => 0, 'response_set' => 0, 'survey' => 0 }
    json['hits']['hits'].each do |hit|
      hit_types[hit['_type']] += 1
    end
    assert_equal 1, hit_types['form']
    assert_equal 1, hit_types['question']
    assert_equal 1, hit_types['response_set']
    assert_equal 1, hit_types['survey']
  end

  test 'can search all types filtered by user ' do
    results = SDP::SimpleSearch.search(nil, 'Search', @admin)
    json = JSON.parse(results.target!)
    # there is only 1 search related fixture for each type that is published
    # with the text  "Search" in the search fields
    # there is also 1 draft owned by the admin user in each so these totals will
    # be 6
    assert_equal 8, json['hits']['total']
    assert_equal 8, json['hits']['hits'].length
    hit_types = { 'form' => 0, 'question' => 0, 'response_set' => 0, 'survey' => 0 }
    json['hits']['hits'].each do |hit|
      hit_types[hit['_type']] += 1
      source = hit['_source']
      assert source['createdBy']['id'] == @admin.id || source['status'] == 'published'
    end
    assert_equal 2, hit_types['form']
    assert_equal 2, hit_types['question']
    assert_equal 2, hit_types['response_set']
    assert_equal 2, hit_types['survey']
  end

  test 'publisher can search other users content ' do
    %w(question form response_set survey).each do |type|
      publisher_search = @publisher ? @publisher.has_role?(:publisher) : false
      publisher_results = SDP::SimpleSearch.search(type, 'Search', @publisher.id, 10, 1, publisher_search)
      publisher_json = JSON.parse(publisher_results.target!)
      publisher_search = @user ? @user.has_role?(:publisher) : false
      user_results = SDP::SimpleSearch.search(type, 'Search', @user.id, 10, 1, publisher_search)
      user_json = JSON.parse(user_results.target!)

      # Publisher should see admin and user's published and draft items
      # (3 for each object type) despite not owning anything itself
      assert_equal 3, publisher_json['hits']['total']
      assert_equal 3, publisher_json['hits']['hits'].length
      publisher_json['hits']['hits'].each do |hit|
        assert_equal type, hit['_type']
      end

      assert_equal 2, user_json['hits']['total']
      assert_equal 2, user_json['hits']['hits'].length
      user_json['hits']['hits'].each do |hit|
        assert_equal type, hit['_type']
        source = hit['_source']
        assert source['createdBy']['id'] == @user.id || source['status'] == 'published'
      end
    end
  end

  test 'users can find duplicate questions' do
    results = SDP::SimpleSearch.find_duplicate_questions('Search Question 1')
    results_json = JSON.parse(results.target!)
    assert_equal 1, results_json['hits']['total']
  end
end
