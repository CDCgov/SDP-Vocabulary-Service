module Api
  class FormsController < Api::ApplicationController
    respond_to :json

    def index
      @forms = if params[:search]
                 Form.includes(:published_by, form_questions: [{ response_set: :responses }, :question]).search(params[:search])
               else
                 Form.includes(:published_by, form_questions: [{ response_set: :responses }, :question]).all
               end
      current_user_id = current_user ? current_user.id : -1
      @forms = if params[:limit]
                 @forms.limit(params[:limit]).where("(status='published' OR created_by_id= ?)", current_user_id)
               else
                 @forms.limit(100).where("(status='published' OR created_by_id= ?)", current_user_id)
               end
      @forms = @forms.order(version_independent_id: :asc)
      render json: @forms, each_serializer: FormSerializer
    end

    def show
      @form = Form.includes(:published_by, form_questions: [{ response_set: :responses }, :question]).by_id_and_version(params[:id], params[:version])
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
