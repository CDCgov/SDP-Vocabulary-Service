# rubocop:disable Metrics/AbcSize
require 'elasticsearch'
require 'sdp/elastic_search'
require 'sdp/simple_search'
class ElasticsearchController < ApplicationController
  def index
    type = params[:type] ? params[:type] : nil
    query_string = params[:search] ? params[:search] : nil
    query_size = params[:size] ? params[:size].to_i : 10
    page = params[:page] ? params[:page].to_i : 1
    current_user_id  = current_user ? current_user.id : -1
    publisher_search = current_user ? current_user.publisher? : false
    results = if SDP::Elasticsearch.ping
                SDP::Elasticsearch.search(type, query_string, page, query_size, current_user_id, publisher_search)
              else
                SDP::SimpleSearch.search(type, query_string, current_user_id, query_size, page, publisher_search).target!
              end
    render json: results
  end
end
# rubocop:enable Metrics/AbcSize
