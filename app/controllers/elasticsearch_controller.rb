require 'elasticsearch'
require 'sdp/elastic_search'

class ElasticsearchController < ApplicationController
  def query_with_type(client, type, query_string)
    client.search index: 'vocabulary', type: type, body: {
      query: {
        match: {
          _all: query_string
        }
      },
      highlight: {
        fields: {
          _all: {}
        }
      }
    }
  end

  def query_without_type(client, query_string)
    client.search index: 'vocabulary', body: {
      query: {
        match: {
          name: query_string
        }
      },
      highlight: {
        fields: {
          name: {}
        }
      }
    }
  end

  def search_on_string(client, type, query_string)
    if type
      query_with_type(client, type, query_string)
    elsif query_string
      query_without_type(client, query_string)
    else
      client.search index: 'vocabulary'
    end
  end

  def index
    type = params[:type] ? params[:type] : nil
    query_string = params[:search] ? params[:search] : nil

    SDP::Elasticsearch.with_client do |client|
      results = if query_string
                  search_on_string(client, type, query_string)
                elsif type
                  client.search index: 'vocabulary', type: type
                else
                  client.search index: 'vocabulary'
                end

      render json: results
    end
  end
end
