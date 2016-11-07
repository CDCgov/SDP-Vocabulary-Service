class ResponseSetsController < ApplicationController
  before_action :set_response_set, only: [:show, :edit, :update, :destroy]
  before_action :set_parent_set, only: [:extend]
  load_and_authorize_resource

  # GET /response_sets
  # GET /response_sets.json
  def index
    @response_sets = ResponseSet.all
  end

  # GET /response_sets/1
  # GET /response_sets/1.json
  def show
  end

  # GET /response_sets/new
  def new
    @response_set = ResponseSet.new
    @response_set.responses.build
  end

  # GET /response_sets/1/edit
  def edit
  end

  def assign_author
    # Populating author field
    @response_set.created_by = current_user
    @response_set.updated_by = current_user
  end

  # POST /response_sets
  # POST /response_sets.json
  def create
    @response_set = ResponseSet.new(response_set_params)
    assign_author

    respond_to do |format|
      if @response_set.save
        format.html { redirect_to @response_set, notice: 'Response set was successfully created.' }
        format.json { render :show, status: :created, location: @response_set }
      else
        format.html { render :new }
        format.json { render json: @response_set.errors, status: :unprocessable_entity }
      end
    end
  end

  def transfer_table
    @response_set.coded = @parent_set.coded
    @response_set.oid = @parent_set.oid
    @response_set.description = @parent_set.description
    @response_set.name = @parent_set.name
    @parent_set.responses.each do |r|
      @response_set.responses << r.dup
    end
  end

  # GET /response_sets/1/extend
  def extend
    @response_set = ResponseSet.new
    transfer_table
  end

  # PATCH/PUT /response_sets/1
  # PATCH/PUT /response_sets/1.json
  def update
    @response_set.updated_by = current_user

    respond_to do |format|
      if @response_set.update(response_set_params)
        format.html { redirect_to @response_set, notice: 'Response set was successfully updated.' }
        format.json { render :show, status: :ok, location: @response_set }
      else
        format.html { render :edit }
        format.json { render json: @response_set.errors, status: :unprocessable_entity }
      end
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

  # Use callbacks to share common setup or constraints between actions.
  def set_response_set
    @response_set = ResponseSet.find(params[:id])
  end

  def set_parent_set
    @parent_set = ResponseSet.find(params[:id])
    @parent_id = @parent_set.id
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def response_set_params
    params.require(:response_set).permit(:name, :description, :parent_id, :oid, :author, :coded,
                                         responses_attributes: [:id, :value, :display_name, :code_system])
  end
end
