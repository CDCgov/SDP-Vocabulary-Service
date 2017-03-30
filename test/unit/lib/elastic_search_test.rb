require 'test_helper'

require 'sdp/elastic_search'

class ElasticSearchTest < ActiveSupport::TestCase
  def test_ensure_index
    SDP::Elasticsearch.ensure_index
    req = FakeWeb.last_request
    assert_equal 'HEAD', req.method
    assert_equal '/vocabulary', req.path
  end

  def test_search_on_string
    SDP::Elasticsearch.with_client do |client|
      SDP::Elasticsearch.search_on_string(client, 10, 1, 'form', 'Hello', '1')
      req = FakeWeb.last_request
      assert_equal 'GET', req.method
      assert_equal '/vocabulary/form/_search', req.path
    end
  end

  def test_search_on_type
    SDP::Elasticsearch.with_client do |client|
      SDP::Elasticsearch.search_on_type(client, 10, 1, 'form', '1')
      req = FakeWeb.last_request
      assert_equal 'GET', req.method
      assert_equal '/vocabulary/form/_search', req.path
    end
  end

  def test_search_all
    SDP::Elasticsearch.with_client do |client|
      SDP::Elasticsearch.search_all(client, 10, 1, '1')
      req = FakeWeb.last_request
      assert_equal 'GET', req.method
      assert_equal '/vocabulary/_search', req.path
    end
  end

  def test_delete_all
    SDP::Elasticsearch.delete_all('form', [1, 2, 3, 4])
    req = FakeWeb.last_request
    assert_equal 'POST', req.method
    assert_equal '/vocabulary/form/_delete_by_query', req.path
  end
end
