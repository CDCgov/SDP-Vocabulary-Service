module Api
  class FormsController < Api::ApplicationController
    respond_to :json

    def index
    end

    def show
      @form = Form.by_id_and_version(params[:id], params[:version])
      if @form.nil?
        not_found
        return
      end
      render json: @form, serializer: FormSerializer
    end
  end
end
