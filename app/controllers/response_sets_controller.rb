class ResponseSetsController < ApplicationController
  load_and_authorize_resource except: [:usage]

  # GET /response_sets
  # GET /response_sets.json
  def index
    @response_sets = params[:search] ? ResponseSet.search(params[:search]).all : ResponseSet.all
  end

  def my_response_sets
    @response_sets = if params[:search]
                       ResponseSet.where('created_by_id=? and name ILIKE ?', current_user.id, "%#{search}%").latest_versions
                     else
                       ResponseSet.where(created_by_id: current_user.id).latest_versions
                     end
    render action: :index, collection: @response_sets
  end

  # GET /response_sets/1
  # GET /response_sets/1.json
  def show
    @response_set = ResponseSet.includes(:responses, :questions, :parent).find(params[:id])
  end

  def usage
    @response_set = ResponseSet.find(params[:id])
    if @response_set.status != 'published'
      render(json: { error: 'Only published Response Sets provide usage information' }, status: :bad_request)
    else
      response = { id: @response_set.id }
      response[:surveillance_programs] = @response_set.surveillance_programs.map(&:name)
      response[:surveillance_systems] = @response_set.surveillance_systems.map(&:name)
      render json: response
    end
  end

  def assign_author
    @response_set.created_by = current_user
    @response_set.updated_by = current_user
  end

  # POST /response_sets
  # POST /response_sets.json
  def create
    @response_set = ResponseSet.new(response_set_params)
    if @response_set.all_versions.count >= 1
      if @response_set.all_versions.last.created_by != current_user
        render(json: @response_set.errors, status: :unauthorized) && return
      elsif @response_set.all_versions.last.status == 'draft'
        render(json: @response_set.errors, status: :unprocessable_entity) && return
      end
      @response_set.version = @response_set.most_recent + 1
    end
    assign_author
    respond_to do |format|
      if @response_set.save
        format.json { render :show, status: :created, location: @response_set }
      else
        format.json { render json: @response_set.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /response_sets/1/publish
  def publish
    if @response_set.status == 'draft'
      @response_set.publish
      render :show, statis: :published, location: @response_set
    else
      render json: @response_set.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /response_sets/1
  # PATCH/PUT /response_sets/1.json
  def update
    if @response_set.status == 'draft'
      @response_set.updated_by = current_user
      update_responses(params)

      if @response_set.update(response_set_params)
        render :show, status: :ok, location: @response_set
      else
        render json: @response_set.errors, status: :unprocessable_entity
      end
    else
      render json: @response_set.errors, status: :unprocessable_entity
    end
  end

  def update_responses(_params)
    @responses = Response.where(response_set_id: @response_set.id)
    @response_set.responses.destroy_all
    @response_set.responses << @responses
  end

  # DELETE /response_sets/1
  # DELETE /response_sets/1.json
  def destroy
    if @response_set.status == 'draft'
      @response_set.questions.destroy_all
      @response_set.destroy
      render json: @response_set
    else
      render json: @response_set.errors, status: :unprocessable_entity
    end
  end

  private

  # Never trust parameters from the scary internet, only allow the white list through.
  def response_set_params
    params.require(:response_set).permit(:name, :description, :parent_id, :oid, :author,
                                         :version_independent_id, :status,
                                         responses_attributes: [:id, :value, :display_name, :code_system])
  end
end
