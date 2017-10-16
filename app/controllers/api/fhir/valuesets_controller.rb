module Api
  module Fhir
    class ValuesetsController < ApplicationController
      def index
      end

      def show
        @response_set = ResponseSet.find(params[:id])
      end
    end
  end
end
