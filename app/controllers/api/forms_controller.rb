module Api
  class FormsController < Api::ApplicationController
    respond_to :json

    def index
      @forms = params[:search] ? Form.search(params[:search]) : Form.all
      @forms = params[:limit] ? @forms.limit(params[:limit]) : @forms
      @forms = @forms.order(version_independent_id: :asc)
      render json: @forms, each_serializer: FormSerializer
    end

    def show
      @form = Form.by_id_and_version(params[:id], params[:version])
      if @form.nil?
        not_found
        return
      end
      render json: @form, serializer: FormSerializer
    end

    def usage
      @form = Form.by_id_and_version(params[:id, params[:version]])
      if @form.nil?
        not_found
        return
      end
      render json: @form, serializer: UsageSerializer
    end
  end
end
