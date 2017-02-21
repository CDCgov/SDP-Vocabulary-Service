require 'elasticsearch'
require 'sdp/elastic_search'

class ElasticsearchController < ApplicationController
  def search_on_string(client, type, query_string)
    if type
      results = client.search index: 'vocabulary', type: type, body: {
        query: {
          match: {
            name: query_string
          }
        }
      }
    elsif query_string
      results = client.search index: 'vocabulary', body: {
        query: {
          match: {
            name: query_string
          }
        }
      }
    else
      results = client.search index: 'vocabulary'
    end
    results
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
