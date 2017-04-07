class QuestionsController < ApplicationController
  load_and_authorize_resource except: [:usage]

  # GET /questions.json
  def index
    @questions = params[:search] ? Question.search(params[:search]).all : Question.all
  end

  def my_questions
    @questions = if params[:search]
                   Question.where('created_by_id=? and content ILIKE ?', current_user.id, "%#{search}%").latest_versions
                 else
                   Question.where(created_by_id: current_user.id).latest_versions
                 end
    render action: :index, collection: @questions
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

    if @question.all_versions.count >= 1
      if @question.all_versions.last.created_by != current_user
        render(json: @question.errors, status: :unauthorized) && return
      elsif @question.all_versions.last.status == 'draft'
        render(json: @question.errors, status: :unprocessable_entity) && return
      end
      @question.version = @question.most_recent + 1
    end
    assign_author
    if @question.save
      render :show, status: :created, location: @question
    else
      # @question_types = QuestionType.all
      render json: @question.errors, status: :unprocessable_entity
    end
  end

  def update_response_sets(params)
    @response_sets = ResponseSet.where(id: params[:linked_response_sets])
    @question.response_sets.destroy_all
    @question.response_sets << @response_sets
  end

  # PATCH/PUT /questions/1/publish
  def publish
    if @question.status == 'draft'
      @question.publish
      render :show, statis: :published, location: @question
    else
      render json: @question.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /questions/1
  # PATCH/PUT /questions/1.json
  def update
    if @question.status == 'published'
      render json: @question.errors, status: :unprocessable_entity
    else
      update_response_sets(params)
      update_concepts(params)
      @question.updated_by = current_user
      if @question.update(question_params)
        render :show, status: :ok, location: @question
      else
        @question_types = QuestionType.all
        render json: @question.errors, status: :unprocessable_entity
      end
    end
  end

  def usage
    @question = Question.find(params[:id])
    if @question.status != 'published'
      render(json: { error: 'Only published Questions provide usage information' }, status: :bad_request)
    else
      response = { id: @question.id }
      response[:surveillance_programs] = @question.surveillance_programs.map(&:name).uniq
      response[:surveillance_systems] = @question.surveillance_systems.map(&:name).uniq
      render json: response
    end
  end

  def update_concepts(_params)
    @concepts = Concept.where(question_id: @question.id)
    @question.concepts.destroy_all
    @question.concepts << @concepts
  end

  # DELETE /questions/1
  # DELETE /questions/1.json
  def destroy
    if @question.status == 'draft'
      @question.concepts.destroy_all
      @question.forms.destroy_all
      @question.response_sets.destroy_all
      @question.destroy
      render json: @question
    else
      render json: @question.errors, status: :unprocessable_entity
    end
  end

  private

  # Never trust parameters from the scary internet, only allow the white list through.
  def question_params
    params.require(:question).permit(:content, :response_set_id, :response_type_id, :parent_id, :question_type_id,
                                     :version_independent_id, :description, :status, :harmonized, :other_allowed,
                                     concepts_attributes: [:id, :value, :display_name, :code_system])
  end
end
