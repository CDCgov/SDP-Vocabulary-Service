module Api
  module Fhir
    class ValuesetsController < ApplicationController
      def index
        @@tracker.pageview(path: "/api/FHIR/valueSets/#{params[:limit]}", hostname: Settings.default_url_helper_host,
                           title: 'API FHIR Reponse Set Show - Search criteria: ' + params[:search].to_s)
        @value_sets = ResponseSet.where("status='published'").includes(:responses, :published_by)
        @value_sets = @value_sets.search(params[:search]) if params[:search]
        limit = params[:limit] && (params[:limit].to_i < 100 || request.env['HTTP_ACCEPT_ENCODING'] == 'gzip') ? params[:limit].to_i : 100
        @value_sets = @value_sets.limit(limit).order(version_independent_id: :asc)
        @offset = 0
        @limit = 100
      end

      def show
        @@tracker.pageview(path: "/api/FHIR/valueSets/#{params[:id]}/#{params[:version]}", hostname: Settings.default_url_helper_host,
                           title: 'API FHIR Response Set Show')
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
