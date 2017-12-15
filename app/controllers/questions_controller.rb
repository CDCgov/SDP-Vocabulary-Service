class QuestionsController < ApplicationController
  load_and_authorize_resource except: [:usage]

  # GET /questions.json
  def index
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
      if @question.not_owned_or_in_group?(current_user)
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
      # @categories = Category.all
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
      if @current_user.publisher?
        @question.publish(@current_user)
        render :show, status: :ok, location: @question
      else
        render json: @question, status: :forbidden
      end
    else
      render json: @question.errors, status: :unprocessable_entity
    end
  end

  def add_to_group
    group = Group.find(params[:group])
    if current_user.groups.include?(group)
      @question.add_to_group(params[:group])
      render :show
    else
      render json: { msg: 'Error adding item - you do not have permissions in that group' }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /questions/1
  # PATCH/PUT /questions/1.json
  def update
    if @question.status == 'published'
      render json: @question.errors, status: :unprocessable_entity
    else
      update_response_sets(params)
      @question.update_concepts('Question')
      @question.updated_by = current_user
      if @question.update(question_params)
        render :show, status: :ok, location: @question
      else
        @categories = Category.all
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
      response[:surveillance_programs] = @question.surveillance_programs.map(&:name)
      response[:surveillance_systems]  = @question.surveillance_systems.map(&:name)
      render json: response
    end
  end

  # DELETE /questions/1
  # DELETE /questions/1.json
  def destroy
    if @question.status == 'draft'
      @question.destroy
      SDP::Elasticsearch.delete_item('question', @question.id, true)
      render json: @question
    else
      render json: @question.errors, status: :unprocessable_entity
    end
  end

  private

  # Never trust parameters from the scary internet, only allow the white list through.
  def question_params
    params.require(:question).permit(:content, :response_set_id, :response_type_id, :parent_id, :category_id, :groups,
                                     :version_independent_id, :description, :status, :other_allowed, :subcategory_id,
                                     concepts_attributes: [:id, :value, :display_name, :code_system])
  end
end
