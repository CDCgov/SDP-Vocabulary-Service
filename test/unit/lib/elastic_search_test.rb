require 'test_helper'

require 'sdp/elastic_search'

class ElasticSearchTest < ActiveSupport::TestCase
  def test_ensure_index
    SDP::Elasticsearch.ensure_index
    req = FakeWeb.last_request
    assert_equal 'HEAD', req.method
    assert_equal '/vocabulary', req.path
  end

  def test_delete_all
    SDP::Elasticsearch.delete_all('form', [1, 2, 3, 4])
    req = FakeWeb.last_request
    assert_equal 'POST', req.method
    assert_equal '/vocabulary/form/_delete_by_query', req.path
  end
end
