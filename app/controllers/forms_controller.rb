class FormsController < ApplicationController
  before_action :set_form, only: [:show, :edit, :update, :destroy]
  load_and_authorize_resource

  # GET /forms
  # GET /forms.json
  def index
    @forms = Form.all
    @questions = Question.all
  end

  # GET /forms/1
  # GET /forms/1.json
  def show
  end

  # GET /forms/new
  def new
    @form = Form.new
    @questions = Question.all
    @response_sets = ResponseSet.latest_versions
  end

  # GET /forms/1/edit
  def edit
    @questions = Question.all
    @response_sets = ResponseSet.latest_versions
  end

  def create_form_questions(form_id, question_ids, response_set_ids)
    if question_ids
      question_ids.zip(response_set_ids).each do |qid, rsid|
        FormQuestion.create(form_id: form_id, question_id: qid, response_set_id: rsid)
      end
    end
  end

  # POST /forms
  # POST /forms.json
  def create
    @form = Form.new(form_params)
    @form.created_by = current_user

    respond_to do |format|
      if @form.save
        create_form_questions(@form.id, params[:question_ids], params[:response_set_ids])
        format.html { redirect_to @form, notice: 'Form was successfully created.' }
        format.json { render :show, status: :created, location: @form }
      else
        format.html { render :new }
        format.json { render json: @form.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /forms/1
  # PATCH/PUT /forms/1.json
  def update
    @form.questions.destroy_all
    create_form_questions(@form.id, params[:question_ids], params[:response_set_ids])

    respond_to do |format|
      if @form.update(form_params)
        format.html { redirect_to @form, notice: 'Form was successfully updated.' }
        format.json { render :show, status: :ok, location: @form }
      else
        format.html { render :edit }
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

  # Use callbacks to share common setup or constraints between actions.
  def set_form
    @form = Form.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def form_params
    params.require(:form).permit(:name, :user_id)
  end
end
