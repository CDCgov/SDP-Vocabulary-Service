class SectionsController < ApplicationController
  load_and_authorize_resource
  before_action :set_paper_trail_whodunnit

  def info_for_paper_trail
    comment = request.params[:comment] || ''
    { comment: comment }
  end

  # GET /sections
  # GET /sections.json
  def index
    @users = User.all
  end

  # GET /sections/1
  # GET /sections/1.json
  def show
  end

  # GET /sections/new
  def new
    @section = Section.new
    load_supporting_resources_for_editing
  end

  # GET /sections/1/export
  def export
    @section = Section.find(params[:id])
  end

  # POST /sections
  # POST /sections.json
  def create
    @section = Section.new(section_params)
    return unless can_section_be_created?(@section)
    @section.created_by = current_user
    @section.section_nested_items = create_section_nested_items
    if @section.save
      render :show, status: :created, location: @section
    else
      render json: @section.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /sections/1
  # PATCH/PUT /sections/1.json
  def update
    if @section.status == 'published'
      render json: { status: 'Published sections cannot be updated.' }, status: :unprocessable_entity
    else
      update_successful = nil
      @section.transaction do
        @section.section_nested_items = update_section_nested_items
        @section.update_concepts('Section')
        # When we assign update_successful, it is the last expression in the block
        # That means, if the section fails to update, this block will return false,
        # which will cause the transaction to rollback.
        update_successful = @section.update(section_params)
      end
      if update_successful
        @section.groups.each do |group|
          @section.add_to_group(group.id)
        end
        render json: @section.to_json, status: :ok
      else
        render json: @section.errors, status: :unprocessable_entity
      end
    end
  end

  # DELETE /sections/1
  # DELETE /sections/1.json
  def destroy
    if @section.status == 'draft'
      if params[:cascade] == 'true'
        @section.cascading_action do |element|
          # Original item for deletion can be used elsewhere, children must not be reused
          element.destroy if element.status == 'draft' && (element.exclusive_use? || element == @section)
        end
      end
      @section.destroy
      render json: @section
    else
      render json: @section.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /sections/1/publish
  def publish
    if @section.status == 'draft'
      @section.publish(current_user)
      render :show
    else
      render json: @section.errors, status: :unprocessable_entity
    end
  end

  def add_to_group
    group = Group.find(params[:group])
    if current_user.groups.include?(group)
      @section.add_to_group(params[:group])
      render :show
    else
      render json: { msg: 'Error adding item - you do not have permissions in that group' }, status: :unprocessable_entity
    end
  end

  def remove_from_group
    group = Group.find(params[:group])
    if current_user.groups.include?(group)
      @section.remove_from_group(params[:group])
      render :show
    else
      render json: { msg: 'Error adding item - you do not have permissions in that group' }, status: :unprocessable_entity
    end
  end

  def update_tags
    @section.add_tags(params)
    if @section.save!
      render :show, status: :ok, location: @section
    else
      render json: @section.errors, status: :unprocessable_entity
    end
  end

  def update_pdv
    if @section.section_nested_item_ids.include?(params[:sni_id])
      sni = SectionNestedItem.find(params[:sni_id])
      sni.program_var = params[:pdv]
      if sni.save!
        render :show, status: :ok, location: @section
      else
        render json: @section.errors, status: :unprocessable_entity
      end
    else
      render json: @section.errors, status: :unprocessable_entity
    end
  end

  # GET /sections/1/redcap
  def redcap
    xml = render_to_string 'sections/redcap.xml', layout: false
    send_data(xml, filename: "#{@section.name.underscore}_redcap.xml",
                   type: 'application/xml',
                   status: 200)
  end

  # GET /sections/1/redcap
  def epi_info
    @tab_counter = 0
    @top = -0.03
    xml = render_to_string 'sections/epi_info.xml', layout: false
    send_data(xml, filename: "#{@section.name.parameterize.underscore}_epi_info.xml",
                   type: 'application/xml',
                   status: 200)
  end

  private

  def can_section_be_created?(section)
    if section.all_versions.count >= 1
      if section.not_owned_or_in_group?(current_user)
        render(json: section.errors, status: :unauthorized)
        return false
      elsif section.all_versions.last.status == 'draft'
        render(json: section.errors, status: :unprocessable_entity)
        return false
      end
      section.version = section.most_recent + 1
    end
    true
  end

  def load_supporting_resources_for_editing
    @questions = params[:search] ? Question.search(params[:search]) : Question.all
    @response_sets = ResponseSet.latest_versions
  end

  def save_message(section)
    action = section.version > 1 ? 'revised' : 'created'
    "Section was successfully #{action}."
  end

  def create_section_nested_items
    section_nested_items = []
    if params[:section][:linked_items]
      params[:section][:linked_items].each do |sni|
        section_nested_items << SectionNestedItem.new(question_id: sni[:question_id], response_set_id: sni[:response_set_id],\
                                                      position: sni[:position], program_var: sni[:program_var],\
                                                      nested_section_id: sni[:nested_section_id])
      end
    end
    section_nested_items
  end

  # !!! this algorithm assumes a question cannot appear twice on the same section !!!
  # Only update section questions that were changed
  def update_section_nested_items
    snis = params[:section][:linked_items]
    updated_snis = []
    updated_snis = @section.update_snis(snis) if snis
    updated_snis
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def section_params
    params.require(:section).permit(:name, :description, :parent_id,
                                    :version_independent_id, :groups,
                                    concepts_attributes: [:id, :value, :display_name, :code_system])
  end
end
