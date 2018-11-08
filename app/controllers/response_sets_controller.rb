class ResponseSetsController < ApplicationController
  load_and_authorize_resource except: [:usage]
  before_action :set_paper_trail_whodunnit

  def info_for_paper_trail
    comment = request.params[:comment] || ''
    association_changes = request.params[:association_changes] || {}
    { comment: comment, associations: association_changes }
  end

  # GET /response_sets
  # GET /response_sets.json
  def index
  end

  # GET /response_sets/1
  # GET /response_sets/1.json
  def show
    @is_edit = params['isEdit'] || false
  end

  def more_responses
    response = { id: params[:id] }
    if params[:page]
      first_item = params[:page].to_i * 25
      last_item = (params[:page].to_i + 1) * 25 - 1
      response[:responses] = @response_set.responses.first((params[:page].to_i + 1) * 25)[first_item..last_item]
      render json: response
    else
      render json: { msg: 'Error adding item - you do not have permissions in that group' }, status: :unprocessable_entity
    end
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

  def update_stage
    if ['Published', 'Draft', 'Comment Only', 'Trial Use'].include?(params[:stage])
      @response_set.update_stage(params[:stage])
      render :show
    else
      render json: @question.errors, status: :unprocessable_entity
    end
  end

  def add_to_group
    group = Group.find(params[:group])
    if current_user.groups.include?(group)
      @response_set.add_to_group(params[:group])
      render :show
    else
      render json: { msg: 'Error adding item - you do not have permissions in that group' }, status: :unprocessable_entity
    end
  end

  def remove_from_group
    group = Group.find(params[:group])
    if current_user.groups.include?(group)
      @response_set.remove_from_group(params[:group])
      render :show
    else
      render json: { msg: 'Error adding item - you do not have permissions in that group' }, status: :unprocessable_entity
    end
  end

  def mark_as_duplicate
    @response_set.mark_as_duplicate(ResponseSet.find(params[:replacement]))
    if @response_set.section_nested_items.count == 0
      rs = ResponseSet.find(@response_set.id)
      rs.destroy
      render json: Survey.find(params[:survey]).potential_duplicates(current_user), status: :ok
    else
      render json: @response_set.errors, status: :unprocessable_entity
    end
  end

  def link_to_duplicate
    @response_set.link_to_duplicate(params[:replacement])
    if @response_set.save!
      render json: Survey.find(params[:survey]).potential_duplicates(current_user), status: :ok
    else
      render json: @response_set.errors, status: :unprocessable_entity
    end
  end

  # POST /response_sets
  # POST /response_sets.json
  def create
    @response_set = ResponseSet.new(response_set_params)
    if @response_set.all_versions.count >= 1
      if @response_set.not_owned_or_in_group?(current_user) || @response_set.prev_not_owned_or_in_group?(current_user)
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
      if @current_user.publisher?
        @response_set.publish(@current_user)
        render :show, status: :ok, location: @response_set
      else
        render json: @response_set, status: :forbidden
      end
    else
      render json: @response_set.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /response_sets/1/retire
  def retire
    if @response_set.status == 'published'
      if @current_user.publisher?
        @response_set.retire
        render :show, status: :ok, location: @response_set
      else
        render json: @response_set, status: :forbidden
      end
    else
      render json: @response_set.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /response_sets/1
  # PATCH/PUT /response_sets/1.json
  def update
    if @response_set.status == 'draft' && @response_set.version_independent_id == response_set_params[:version_independent_id]
      @response_set.minor_change_count += 1 if params[:unsaved_state]
      @response_set.updated_by = current_user
      update_responses(params)

      if @response_set.update(response_set_params)
        render :show, status: :ok, location: @response_set
      else
        render json: @response_set.errors, status: :forbidden
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

  def update_tags
    @response_set.tag_list = params['tag_list']
    if params['tag_list'] && @response_set.save!
      render :show, status: :ok, location: @response_set
    else
      render json: @response_set.errors, status: :unprocessable_entity
    end
  end

  # DELETE /response_sets/1
  # DELETE /response_sets/1.json
  def destroy
    if @response_set.status == 'draft'
      @response_set.destroy
      render json: @response_set
    else
      render json: @response_set.errors, status: :unprocessable_entity
    end
  end

  private

  # Never trust parameters from the scary internet, only allow the white list through.
  def response_set_params
    params.require(:response_set).permit(:name, :description, :parent_id, :oid,
                                         :version_independent_id, :groups, tag_list: [],
                                                                           responses_attributes: [:id, :value, :display_name, :code_system])
  end
end
