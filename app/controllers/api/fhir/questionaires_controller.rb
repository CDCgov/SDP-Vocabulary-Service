module Api
  module Fhir
    class QuestionairesController < ApplicationController
      def index
        @surveys = if params[:_content]
                     Survey.includes(:published_by, survey_sections:
                                      [section: { section_questions: [:response_set, :question] }]).search(params[:_content])
                   else
                     Survey.includes(:published_by, survey_sections: [section: { section_questions: [:response_set, :question] }]).all
                   end
        current_user_id = current_user ? current_user.id : -1
        @surveys = if params[:limit]
                     @surveys.limit(params[:limit]).where("(status='published' OR created_by_id= ?)", current_user_id)
                   else
                     @surveys.limit(100).where("(status='published' OR created_by_id= ?)", current_user_id)
                   end
        @surveys = @surveys.order(version_independent_id: :asc)
      end

      def show
        @survey = Survey.find(params[:id])
      end
    end
  end
end
