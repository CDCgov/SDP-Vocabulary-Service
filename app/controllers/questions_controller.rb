class QuestionsController < ApplicationController
  before_action :set_question, only: [:show, :edit, :update, :destroy]
  load_and_authorize_resource

  # GET /questions
  # GET /questions.json
  def index
    @questions = Question.latest_versions
    @response_sets = ResponseSet.all
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
  def revise
    q_to_revise = Question.find(params[:id])
    @question = q_to_revise.build_new_revision
    @response_sets = ResponseSet.all
    @question_types = QuestionType.all
  end

  def link_response_sets(params)
    @response_sets = ResponseSet.where(id: params[:linked_response_sets])
    @question.response_sets << @response_sets
  end

  def assign_author
    # Populating author field
    @question.created_by = current_user
    @question.updated_by = current_user
  end

  # POST /questions
  # POST /questions.json
  def create
    @question = Question.new(question_params)
    link_response_sets(params)
    assign_author

    respond_to do |format|
      if @question.save
        q_action = 'created'
        q_action = 'revised' if @question.version > 1
        format.html { redirect_to @question, notice: "Question was successfully #{q_action}." }
        format.json { render :show, status: :created, location: @question }
      else
        format.html { render :new }
        format.json { render json @question.errors, status: :unprocessable_entity }
      end
    end
  end

  def update_response_sets(params)
    @response_sets = ResponseSet.where(id: params[:linked_response_sets])
    @question.response_sets.destroy_all
    @question.response_sets << @response_sets
  end

  # PATCH/PUT /questions/1
  # PATCH/PUT /questions/1.json
  def update
    update_response_sets(params)
    @question.updated_by = current_user

    respond_to do |format|
      if @question.update(question_params)
        format.html { redirect_to @question, notice: 'Question was successfully updated.' }
        format.json { render :show, status: :ok, location: @question }
      else
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
    params.require(:question).permit(:content, :author, :response_set_id, :question_type_id, :version, :version_independent_id)
  end
end
