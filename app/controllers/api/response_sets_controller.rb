# rubocop:disable Metrics/LineLength
# rubocop:disable Metrics/AbcSize

module Api
  class ResponseSetsController < Api::ApplicationController
    respond_to :json

    def index
      @@tracker.pageview(path: "/api/valueSets/#{params[:oid]}/#{params[:limit]}", hostname: Settings.default_url_helper_host, title: 'API Response Sets Show - Search criteria: ' + params[:search].to_s)
      if params[:oid]
        @value_sets = ResponseSet.select(Arel.star).where(ResponseSet.arel_table[:oid].eq(params[:oid])).order(:version).reverse_order.limit(1)
      else
        @value_sets = params[:search] ? ResponseSet.search(params[:search]) : ResponseSet.all.includes(:responses, :published_by)
        current_user_id = current_user ? current_user.id : -1
        @value_sets = if params[:limit] && (params[:limit].to_i < 100 || request.env['HTTP_ACCEPT_ENCODING'] == 'gzip')
                        @value_sets.limit(params[:limit].to_i).where("(status='published' OR created_by_id= ?)", current_user_id)
                      else
                        @value_sets.limit(100).where("(status='published' OR created_by_id= ?)", current_user_id)
                      end
        @value_sets = @value_sets.order(version_independent_id: :asc)
      end

      if @value_sets.compact.empty?
        not_found
        return
      end
      render json: @value_sets, each_serializer: ValueSetsSerializer
    end

    def show
      @value_set = ResponseSet.by_id_and_version(params[:id].upcase, params[:version])
      if @value_set.nil?
        @@tracker.pageview(path: "/api/valueSets/#{params[:id]}/#{params[:version]}", hostname: Settings.default_url_helper_host, title: 'API Response Set Not Found')
        not_found
        return
      else
        @@tracker.pageview(path: "/api/valueSets/#{params[:id]}/#{params[:version]}", hostname: Settings.default_url_helper_host, title: 'API Response Set Show')
        render json: @value_set, serializer: ValueSetsSerializer
      end
    end

    def usage
      @value_set = ResponseSet.by_id_and_version(params[:id].upcase, params[:version])
      if @value_set.nil?
        @@tracker.pageview(path: "/api/valueSetsUsage/#{params[:id]}/#{params[:version]}", hostname: Settings.default_url_helper_host, title: 'API Response Set Usage Not Found')
        not_found
        return
      else
        @@tracker.pageview(path: "/api/valueSetsUsage/#{params[:id]}/#{params[:version]}", hostname: Settings.default_url_helper_host, title: 'API Response Set Usage Show')
        render json: @value_set, serializer: ValueSetsSerializer
      end
    end
  end
end
