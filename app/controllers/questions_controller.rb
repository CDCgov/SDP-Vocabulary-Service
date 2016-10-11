class QuestionsController < ApplicationController
  before_action :set_question, only: [:show, :edit, :update, :destroy]
  load_and_authorize_resource

  # GET /questions
  # GET /questions.json
  def index
    @questions = Question.all
  end

  # GET /questions/1
  # GET /questions/1.json
  def show
  end

  # GET /questions/new
  def new
    @question = Question.new
    @response_sets = ResponseSet.all
    @question_types = QuestionType.all
  end

  # GET /questions/1/edit
  def edit
    @response_sets = ResponseSet.all
    @question_types = QuestionType.all
  end

  # POST /questions
  # POST /questions.json
  def create
    @question = Question.new(question_params)
    ## Populating author field
    # Change to .uid once User.uid is properly populated
    # (currently null - need to evalute a devise uid generation extension)
    @question.author = current_user.email

    respond_to do |format|
      if @question.save
        format.html { redirect_to @question, notice: 'Question was successfully created.' }
        format.json { render :show, status: :created, location: @question }
      else
        @response_sets = ResponseSet.all
        @question_types = QuestionType.all
        format.html { render :new }
        format.json { render json @question.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /questions/1
  # PATCH/PUT /questions/1.json
  def update
    respond_to do |format|
      if @question.update(question_params)
        format.html { redirect_to @question, notice: 'Question was successfully updated.' }
        format.json { render :show, status: :ok, location: @question }
      else
        @response_sets = ResponseSet.all
        @question_types = QuestionType.all
        format.html { render :edit }
        format.json { render json: @question.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /questions/1
  # DELETE /questions/1.json
  def destroy
    @question.destroy
    respond_to do |format|
      format.html { redirect_to questions_url, notice: 'Question was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_question
    @question = Question.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def question_params
    params.require(:question).permit(:content, :author, :response_set_id, :question_type_id)
  end
end
