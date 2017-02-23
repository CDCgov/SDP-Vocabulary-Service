require 'elasticsearch'
require 'sdp/elastic_search'

class ElasticsearchController < ApplicationController
  def index
    type = params[:type] ? params[:type] : nil
    query_string = params[:search] ? params[:search] : nil

    SDP::Elasticsearch.with_client do |client|
      results = if query_string
                  SDP::Elasticsearch.search_on_string(client, type, query_string)
                elsif type
                  client.search index: 'vocabulary', type: type
                else
                  client.search index: 'vocabulary'
                end

      render json: results
    end
  end
end
