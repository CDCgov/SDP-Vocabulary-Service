module Api
  module Fhir
    class QuestionairesController < ApplicationController
      def index
      end

      def show
        @survey = Survey.find(params[:id])
      end
    end
  end
end
