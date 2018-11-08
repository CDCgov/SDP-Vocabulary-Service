module Api
  module Fhir
    class QuestionairesController < ApplicationController
      def index
        @surveys = Survey.includes(:published_by, survey_sections:
                         [section: { section_nested_items: [:response_set, :question, :nested_section] }]).where("status='published'")
        @surveys = @surveys.search(params[:_content]) if params[:_content]
        limit = params[:limit] && (params[:limit] < 100 || request.env['HTTP_ACCEPT_ENCODING'] == 'gzip') ? params[:limit] : 100
        @surveys = @surveys.limit(limit).order(version_independent_id: :asc)
      end

      def show
        @survey = Survey.by_id_and_version(params[:id], params[:version])
        if @survey.nil?
          not_found
          return
        end
      end
    end
  end
end
