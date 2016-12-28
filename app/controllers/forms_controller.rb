class FormsController < ApplicationController
  load_and_authorize_resource

  # GET /forms
  # GET /forms.json
  def index
    @forms = Form.latest_versions
    @users = User.all
  end

  # GET /forms/1
  # GET /forms/1.json
  def show
  end

  # GET /forms/new
  def new
    @form = Form.new
    load_supporting_resources_for_editing
  end

  # GET /forms/1/revise
  def revise
    load_supporting_resources_for_editing

    original_form = Form.find(params[:id])
    @form = original_form.build_new_revision
    @selected_questions = original_form.questions
  end

  # GET /forms/1/export
  def export
    @form = Form.find(params[:id])
  end

  # POST /forms
  # POST /forms.json
  def create
    @form = Form.new(form_params)
    @form.created_by = current_user

    respond_to do |format|
      if @form.save
        create_form_questions(@form.id, params[:question_ids], params[:response_set_ids])
        format.html { redirect_to @form, notice: save_message(@form) }
        format.json { render :show, status: :created, location: @form }
      else
        load_supporting_resources_for_editing
        format.html { render :new }
        format.json { render json: @form.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /forms/1
  # DELETE /forms/1.json
  def destroy
    @form.questions.destroy_all
    @form.destroy
    respond_to do |format|
      format.html { redirect_to forms_url, notice: 'Form was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  def load_supporting_resources_for_editing
    @questions = params[:search] ? Question.search(params[:search]) : Question.all
    @response_sets = ResponseSet.latest_versions
  end

  def save_message(form)
    action = form.version > 1 ? 'revised' : 'created'
    "Form was successfully #{action}."
  end

  def create_form_questions(form_id, question_ids, response_set_ids)
    if question_ids
      question_ids.zip(response_set_ids).each do |qid, rsid|
        FormQuestion.create(form_id: form_id, question_id: qid, response_set_id: rsid)
      end
    end
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def form_params
    params.require(:form).permit(:name, :user_id, :search, :version,
                                 :version_independent_id, :control_number)
  end
end
