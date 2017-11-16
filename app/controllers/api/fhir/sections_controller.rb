module Api
  module Fhir
    class SectionsController < ApplicationController
      def index
        @sections = Section.includes(:published_by, survey_sections:
                                      [section: { section_questions: [:response_set, :question] }]).where("status='published'")
        @sections = @sections.search(params[:_content]) if params[:_content]
        limit = params[:limit] || 100
        @sections = @sections.limit(limit).order(version_independent_id: :asc)
      end

      def show
        @section = Section.by_id_and_version(params[:id], params[:version])
        if @section.nil?
          not_found
          return
        end
      end
    end
  end
end
