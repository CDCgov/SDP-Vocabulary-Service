class FormQuestionsController < ApplicationController
  before_action :set_form_question, only: [:show, :edit, :update, :destroy]

  # GET /form_questions
  # GET /form_questions.json
  def index
    @form_questions = FormQuestion.all
  end

  # GET /form_questions/1
  # GET /form_questions/1.json
  def show
  end

  # GET /form_questions/new
  def new
    @form_question = FormQuestion.new
  end

  # GET /form_questions/1/edit
  def edit
  end

  # POST /form_questions
  # POST /form_questions.json
  def create
    @form_question = FormQuestion.new(form_question_params)

    respond_to do |format|
      if @form_question.save
        format.html { redirect_to @form_question, notice: 'Form question was successfully created.' }
        format.json { render :show, status: :created, location: @form_question }
      else
        format.html { render :new }
        format.json { render json: @form_question.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /form_questions/1
  # PATCH/PUT /form_questions/1.json
  def update
    respond_to do |format|
      if @form_question.update(form_question_params)
        format.html { redirect_to @form_question, notice: 'Form question was successfully updated.' }
        format.json { render :show, status: :ok, location: @form_question }
      else
        format.html { render :edit }
        format.json { render json: @form_question.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /form_questions/1
  # DELETE /form_questions/1.json
  def destroy
    @form_question.destroy
    respond_to do |format|
      format.html { redirect_to form_questions_url, notice: 'Form question was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_form_question
    @form_question = FormQuestion.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def form_question_params
    params.require(:form_question).permit(:form_id, :question_id, :response_set_id)
  end
end
