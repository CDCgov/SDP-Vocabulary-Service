require 'test_helper'

require 'sdp/elastic_search'
require 'elastic_helpers'

class ElasticSearchTest < ActiveSupport::TestCase
  def test_ensure_index
    SDP::Elasticsearch.ensure_index
    req = FakeWeb.last_request
    assert_equal 'HEAD', req.method
    assert_equal '/vocabulary', req.path
  end

  def test_search_on_string
    SDP::Elasticsearch.search(nil, 'Hello', 1)
    req = FakeWeb.last_request
    assert_equal 'GET', req.method
    assert_equal '/vocabulary/_search', req.path
  end

  def test_search_on_type
    SDP::Elasticsearch.search('section', 'Hello', 1)
    req = FakeWeb.last_request
    assert_equal 'GET', req.method
    assert_equal '/vocabulary/section/_search', req.path
  end

  def test_search_all
    SDP::Elasticsearch.search(nil, nil, 1, 10)
    req = FakeWeb.last_request
    assert_equal 'GET', req.method
    assert_equal '/vocabulary/_search', req.path
  end

  def test_delete_all
    SDP::Elasticsearch.delete_all('section', [1, 2, 3, 4])
    req = FakeWeb.last_request
    assert_equal 'POST', req.method
    assert_equal '/vocabulary/section/_delete_by_query', req.path
  end

  def find_duplicate_questions
    SDP::Elasticsearch.find_duplicate_questions('content', 'description')
    req = FakeWeb.last_request
    assert_equal 'GET', req.method
    assert_equal '/vocabulary/question/_search', req.path
  end

  def test_batch_find_duplicates
    SDP::Elasticsearch.batch_find_duplicates([questions(:one), questions(:two)], users(:admin).id)
    req = FakeWeb.last_request
    assert_equal 'GET', req.method
    assert_equal '/_msearch', req.path
  end

  def test_batch_duplicate_finder
    old_impl = SDP::Elasticsearch.singleton_method(:batch_find_duplicates)
    begin
      SDP::Elasticsearch.define_singleton_method(:batch_find_duplicates) do |objs, _user_id, _groups|
        { 'responses' => objs }
      end
      bdf = SDP::Elasticsearch::BatchDuplicateFinder.new
      bdf.add_to_batch('foo', :test_category) do |result|
        assert_equal 'foo', result
        'dupe question'
      end
      batch_result = bdf.execute(users(:admin).id)
      assert batch_result
      assert_equal 'dupe question', batch_result[:test_category].first
    ensure
      SDP::Elasticsearch.define_singleton_method(:batch_find_duplicates, old_impl)
    end
  end
end
