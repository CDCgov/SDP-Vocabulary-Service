class SectionsController < ApplicationController
  load_and_authorize_resource

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
    @section.section_questions = create_section_questions
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
        @section.section_questions = update_section_questions
        @section.update_concepts('Section')
        # When we assign update_successful, it is the last expression in the block
        # That means, if the section fails to update, this block will return false,
        # which will cause the transaction to rollback.
        update_successful = @section.update(section_params)
      end
      if update_successful
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
      @section.destroy
      SDP::Elasticsearch.delete_item('section', @section.id, true)
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

  def update_tags
    @section.add_tags(params)
    if @section.save!
      render :show, status: :ok, location: @section
    else
      render json: @section.errors, status: :unprocessable_entity
    end
  end

  def update_pdv
    if @section.section_question_ids.include?(params[:sq_id])
      sq = SectionQuestion.find(params[:sq_id])
      sq.program_var = params[:pdv]
      if sq.save!
        render :show, status: :ok, location: @survey
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

  def create_section_questions
    section_questions = []
    if params[:section][:linked_questions]
      params[:section][:linked_questions].each do |q|
        section_questions << SectionQuestion.new(question_id: q[:question_id], response_set_id: q[:response_set_id],\
                                                 position: q[:position], program_var: q[:program_var])
      end
    end
    section_questions
  end

  # !!! this algorithm assumes a question cannot appear twice on the same section !!!
  # Only update section questions that were changed
  def update_section_questions
    sqs = params[:section][:linked_questions]
    updated_sqs = []
    updated_sqs = @section.update_sqs(sqs) if sqs
    updated_sqs
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def section_params
    params.require(:section).permit(:name, :user_id, :search, :description, :parent_id,
                                    :status, :version_independent_id, :groups,
                                    concepts_attributes: [:id, :value, :display_name, :code_system])
  end
end
