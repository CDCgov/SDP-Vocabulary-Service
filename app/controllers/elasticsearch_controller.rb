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
    current_user_id = current_user ? current_user.id : -1
    groups = current_user ? current_user.groups : []
    must_filters = must_filter_defaults(params)
    results = if SDP::Elasticsearch.ping
                SDP::Elasticsearch.search(type, query_string, page, query_size, must_filters, current_user_id, groups)
              else
                SDP::SimpleSearch.search(type, query_string, current_user_id,
                                         query_size, page, must_filters['publisher'],
                                         must_filters['mystuff'], must_filters['nested_section']).target!
              end
    render json: results
  end

  def export
    type = params[:type] ? params[:type] : nil
    query_string = params[:search] ? params[:search] : nil
    query_size = params[:size] ? params[:size].to_i : 10
    page = params[:page] ? params[:page].to_i : 1
    current_user_id = current_user ? current_user.id : -1
    groups = current_user ? current_user.groups : []
    must_filters = must_filter_defaults(params)
    @results = if SDP::Elasticsearch.ping
                 # Confirm Cap on Query size
                 SDP::Elasticsearch.search(type, query_string, 1, 1000, must_filters, current_user_id, groups)
               else
                 SDP::SimpleSearch.search(type, query_string, current_user_id,
                                          query_size, page, must_filters['publisher'],
                                          must_filters['mystuff'], must_filters['nested_section']).target!
               end
    render xlsx: "search_report_#{Time.zone.now.strftime('%Y-%m-%d_%H-%M-%S')}", template: 'shared/search_spreadsheet.xlsx.axlsx'
  end

  def must_filter_defaults(params)
    must_filters = {}
    must_filters['group_id'] = params[:groups] ? params[:groups].to_i : 0
    must_filters['publisher'] = current_user ? current_user.publisher? : false
    must_filters['mystuff'] = params[:mystuff] == 'true'
    must_filters['programs'] = params[:programs] ? params[:programs] : []
    must_filters['systems'] = params[:systems] ? params[:systems] : []
    must_filters['current_version'] = params[:mostrecent] == 'true'
    must_filters['content_since'] = params[:contentSince]
    must_filters['sort'] = params[:sort] ? params[:sort] : ''
    must_filters['nested_section'] = params[:nsfilter] ? params[:nsfilter] : nil
    must_filters['retired'] = params[:retired] ? params[:retired] : nil
    must_filters['preferred'] = params[:preferred] ? params[:preferred] : false
    must_filters['omb'] = params[:omb] ? params[:omb] : false
    must_filters['status'] = params[:status] ? params[:status] : ''
    must_filters['stage'] = params[:stage] ? params[:stage] : []
    must_filters['category'] = params[:category] ? params[:category].map { |cat| cat.underscore.split(' ')[0] } : []
    must_filters['rt'] = params[:rt] ? params[:rt].map { |rt| rt.underscore.split(' ')[0] } : []
    must_filters['source'] = params[:source] ? params[:source] : ''
    must_filters['data_collection_methods'] = params[:methods]
    must_filters['omb_approval_date'] = params[:ombDate]
    must_filters
  end

  def duplicate_questions
    results = if SDP::Elasticsearch.ping
                current_user_id = current_user ? current_user.id : -1
                groups = current_user ? current_user.groups : []
                content = params[:content]
                content ||= ''
                description = params[:description]
                description ||= ''
                SDP::Elasticsearch.find_duplicate_questions(content, description, current_user_id, groups)
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
