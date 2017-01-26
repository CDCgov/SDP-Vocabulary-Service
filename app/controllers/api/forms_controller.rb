module Api
  class FormsController < ApplicationController
    respond_to :json

    def index
    end

    def show
      @form = Form.by_id_and_version(params[:id], params[:version])
      render json: @form, serializer: FormSerializer
    end
  end
end
