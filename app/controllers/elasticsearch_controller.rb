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
    my_stuff_filter = params[:mystuff] == 'true'
    program_filter = params[:programs] ? params[:programs] : []
    system_filter = params[:systems] ? params[:systems] : []
    current_version_filter = params[:mostrecent] == 'true'
    content_since = params[:contentSince]
    results = if SDP::Elasticsearch.ping
                SDP::Elasticsearch.search(type, query_string, page, query_size,
                                          current_user_id, publisher_search,
                                          my_stuff_filter, program_filter,
                                          system_filter, current_version_filter, content_since)
              else
                SDP::SimpleSearch.search(type, query_string, current_user_id,
                                         query_size, page, publisher_search,
                                         my_stuff_filter).target!
              end
    render json: results
  end

  def duplicate_questions
    results = if SDP::Elasticsearch.ping
                content = params[:content]
                content ||= ''
                description = params[:description]
                description ||= ''
                SDP::Elasticsearch.find_duplicate_questions(content, description)
              else
                SDP::SimpleSearch.find_duplicate_questions(params[:content]).target!
              end
    render json: results
  end

  def suggestions
    results = if SDP::Elasticsearch.ping
                prefix = params[:prefix]
                prefix ||= ''
                SDP::Elasticsearch.find_suggestions(prefix)
              else
                { suggest: { search_suggest: [options: []] } }
              end
    render json: results
  end
end
# rubocop:enable Metrics/AbcSize
