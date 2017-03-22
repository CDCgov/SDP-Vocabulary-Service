require 'elasticsearch'
require 'sdp/elastic_search'
require 'sdp/simple_search'
class ElasticsearchController < ApplicationController
  def index
    type = params[:type] ? params[:type] : nil
    query_string = params[:search] ? params[:search] : nil
    current_user_id = current_user ? current_user.id : -1
    results = if SDP::Elasticsearch.ping
                SDP::Elasticsearch.search(type, query_string, current_user_id)
              else
                SDP::SimpleSearch.search(type, query_string, current_user_id).target!
              end
    render json: results
  end
end
