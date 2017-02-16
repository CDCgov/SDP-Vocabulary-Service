class ResponseSetsController < ApplicationController
  load_and_authorize_resource

  # GET /response_sets
  # GET /response_sets.json
  def index
    @response_sets = params[:search] ? ResponseSet.search(params[:search]).latest_versions : ResponseSet.latest_versions
  end

  # GET /response_sets/1
  # GET /response_sets/1.json
  def show
    @response_set = ResponseSet.includes(:responses, :questions, :parent).find(params[:id])
  end

  # POST /response_sets
  # POST /response_sets.json
  def create
    @response_set = ResponseSet.new(response_set_params)
    @response_set.created_by = current_user
    @response_set.updated_by = current_user

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
    else
      render json: @response_set.errors, status: :unprocessable_entity
    end
  end

  # DELETE /response_sets/1
  # DELETE /response_sets/1.json
  def destroy
    @response_set.destroy
    respond_to do |format|
      format.html { redirect_to response_sets_url, notice: 'Response set was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  # Never trust parameters from the scary internet, only allow the white list through.
  def response_set_params
    params.require(:response_set).permit(:name, :description, :parent_id, :oid, :author, :coded, :version,
                                         :version_independent_id, :status,
                                         responses_attributes: [:id, :value, :display_name, :code_system])
  end
end
