class QuestionResponseSetsController < ApplicationController
  before_action :set_question_response_set, only: [:show, :edit, :update, :destroy]
  load_and_authorize_resource

  # GET /question_response_sets
  # GET /question_response_sets.json
  def index
    @question_response_sets = QuestionResponseSet.all
  end

  # GET /question_response_sets/1
  # GET /question_response_sets/1.json
  def show
  end

  # GET /question_response_sets/new
  def new
    @question_response_set = QuestionResponseSet.new
  end

  # GET /question_response_sets/1/edit
  def edit
  end

  # POST /question_response_sets
  # POST /question_response_sets.json
  def create
    @question_response_set = QuestionResponseSet.new(question_response_set_params)

    respond_to do |format|
      if @question_response_set.save
        format.html { redirect_to @question_response_set, notice: 'Question response set was successfully created.' }
        format.json { render :show, status: :created, location: @question_response_set }
      else
        format.html { render :new }
        format.json { render json: @question_response_set.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /question_response_sets/1
  # PATCH/PUT /question_response_sets/1.json
  def update
    respond_to do |format|
      if @question_response_set.update(question_response_set_params)
        format.html { redirect_to @question_response_set, notice: 'Question response set was successfully updated.' }
        format.json { render :show, status: :ok, location: @question_response_set }
      else
        format.html { render :edit }
        format.json { render json: @question_response_set.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /question_response_sets/1
  # DELETE /question_response_sets/1.json
  def destroy
    @question_response_set.destroy
    respond_to do |format|
      format.html { redirect_to question_response_sets_url, notice: 'Question response set was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_question_response_set
    @question_response_set = QuestionResponseSet.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def question_response_set_params
    params.require(:question_response_set).permit(:question_id, :response_set_id)
  end
end
