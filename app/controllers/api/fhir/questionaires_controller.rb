# rubocop:disable Questionaire/LineLength

module Api
  module Fhir
    class QuestionairesController < ApplicationController
      def index
        @@tracker.pageview(path: "/api/FHIR/questions/#{params[:limit]}", hostname: Settings.default_url_helper_host, title: 'API FHIR Question Show - Search content: ' + @_content)

        @surveys = Survey.includes(:published_by, survey_sections:
                         [section: { section_nested_items: [:response_set, :question, :nested_section] }]).where("status='published'")
        @surveys = @surveys.search(params[:_content]) if params[:_content]
        limit = params[:limit] && (params[:limit].to_i < 100 || request.env['HTTP_ACCEPT_ENCODING'] == 'gzip') ? params[:limit].to_i : 100
        @surveys = @surveys.limit(limit).order(version_independent_id: :asc)
      end

      def show
        @@tracker.pageview(path: "/api/FHIR/questions/#{params[:id]}/#{params[:version]}", hostname: Settings.default_url_helper_host, title: 'API FHIR Question Show')

        @survey = Survey.by_id_and_version(params[:id], params[:version])
        if @survey.nil?
          not_found
          return
        end
      end
    end
  end
end
