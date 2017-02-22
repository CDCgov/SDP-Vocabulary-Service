require 'elasticsearch'
require 'sdp/elastic_search'

class ElasticsearchController < ApplicationController
  def query_with_type(client, type, query_string)
    client.search index: 'vocabulary', type: type, body: {
      query: {
        dis_max: {
          queries: [
            { match: { name: query_string } },
            { match: { description: query_string } }
          ]
        }
      },
      highlight: {
        pre_tags: ['<strong>'],
        post_tags: ['</strong>'],
        fields: {
          name: {}, description: {}
        }
      }
    }
  end

  def query_without_type(client, query_string)
    client.search index: 'vocabulary', body: {
      query: {
        dis_max: {
          queries: [
            { match: { name: query_string } },
            { match: { description: query_string } }
          ]
        }
      },
      highlight: {
        pre_tags: ['<strong>'],
        post_tags: ['</strong>'],
        fields: {
          name: {}, description: {}
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
