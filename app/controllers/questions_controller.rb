class QuestionsController < ApplicationController
  load_and_authorize_resource

  # GET /questions.json
  def index
    @questions = params[:search] ? Question.search(params[:search]).latest_versions : Question.latest_versions
    render json: @questions
  end

  # GET /questions/1
  # GET /questions/1.json
  def show
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
        @question_types = QuestionType.all
        format.html { render :new }
        format.json { render json: @question.errors, status: :unprocessable_entity }
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
    render json: @question
  end

  private

  # Never trust parameters from the scary internet, only allow the white list through.
  def question_params
    params.require(:question).permit(:content, :response_set_id, :response_type_id, :question_type_id, :version, :version_independent_id,
                                     :description, :status, concepts_attributes: [:id, :value, :display_name, :code_system])
  end
end
