module Api
  module Fhir
    class ValuesetsController < ApplicationController
      def index
        @value_sets = ResponseSet.where("status='published'").includes(:responses, :published_by)
        @value_sets = @value_sets.search(params[:search]) if params[:search]
        limit = params[:limit] && (params[:limit] < 100 || request.env['HTTP_ACCEPT_ENCODING'] == 'gzip') ? params[:limit] : 100
        @value_sets = @value_sets.limit(limit).order(version_independent_id: :asc)
        @offset = 0
        @limit = 100
      end

      def show
        @value_set = ResponseSet.by_id_and_version(params[:id], params[:version])
        if @value_set.nil?
          not_found
          return
        end
        @limit = params[:count].nil? || params[:count] > 1000 || params[:count] < 0 ? 1000 : params[:count]
        @offset = params[:offset] && params[:offset] >= 0 ? params[:offset] : 0
      end
    end
  end
end
