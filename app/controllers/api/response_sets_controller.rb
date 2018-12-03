# rubocop:disable Metrics/AbcSize
module Api
  class ResponseSetsController < Api::ApplicationController
    respond_to :json

    def index
      if params[:oid]
        @value_sets = [ResponseSet.find_by(oid: params[:oid])]
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
        not_found
        return
      end
      render json: @value_set, serializer: ValueSetsSerializer
    end

    def usage
      @value_set = ResponseSet.by_id_and_version(params[:id].upcase, params[:version])
      if @value_set.nil?
        not_found
        return
      end
      render json: @value_set, serializer: UsageSerializer
    end
  end
end
