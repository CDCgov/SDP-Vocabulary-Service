require 'elasticsearch'
require 'sdp/elastic_search'

class ElasticsearchController < ApplicationController
  def index
    type = params[:type] ? params[:type] : nil
    query_string = params[:search] ? params[:search] : nil
    current_user_id = current_user ? current_user.id : -1
    SDP::Elasticsearch.with_client do |client|
      results = if query_string
                  SDP::Elasticsearch.search_on_string(client, type, query_string, current_user_id)
                elsif type
                  SDP::Elasticsearch.search_on_type(client, type, current_user_id)
                else
                  SDP::Elasticsearch.search_all(client, current_user_id)
                end

      render json: results
    end
  end
end
