class SurveysController < ApplicationController
  load_and_authorize_resource
  def index
    @users = User.all
  end

  def show
  end

  def new
    @survey = Survey.new
    load_supporting_resources_for_editing
  end

  def create
    @survey = Survey.new(survey_params)
    return unless can_survey_be_created?(@survey)
    @survey.created_by = current_user
    @survey.surveillance_system = current_user.last_system
    @survey.surveillance_program = current_user.last_program
    @survey.survey_sections = create_survey_sections
    if @survey.save
      render :show, status: :created, location: @survey
    else
      render json: @survey.errors, status: :unprocessable_entity
    end
  end

  def update
    if @survey.status == 'published'
      render json: { status: ' Published surveys cannot be updated.' }, status: :unprocessable_entity
    else
      update_successful = nil
      @survey.transaction do
        @survey.surveillance_system  = current_user.last_system
        @survey.surveillance_program = current_user.last_program
        @survey.survey_sections = update_survey_sections
        @survey.update_concepts('Survey')
        update_successful = @survey.update(survey_params)
      end
      if update_successful
        render json: @survey.to_json, status: :ok
      else
        render json: @survey.errors, status: :unprocessable_entity
      end
    end
  end

  def destroy
    if @survey.status == 'draft'
      @survey.destroy
      SDP::Elasticsearch.delete_item('survey', @survey.id, true)
      render json: @survey
    else
      render json: @survey.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /surveys/1/publish
  def publish
    if @survey.status == 'draft'
      if @current_user.publisher?
        @survey.publish(@current_user)
        render :show
      else
        render json: @survey.errors, status: :forbidden
      end

    else
      render json: @survey.errors, status: :unprocessable_entity
    end
  end

  def add_to_group
    group = Group.find(params[:group])
    if current_user.groups.include?(group)
      @survey.add_to_group(params[:group])
      render :show
    else
      render json: { msg: 'Error adding item - you do not have permissions in that group' }, status: :unprocessable_entity
    end
  end

  def update_tags
    tag_params = params.permit(:concepts_attributes, concepts_attributes: [:value, :display_name, :code_system])
    @survey.concepts.destroy_all
    tag_params[:concepts_attributes].each do |c|
      concept = Concept.new(c)
      concept.save!
      @survey.concepts << concept
    end
    if @survey.save!
      render :show, status: :ok, location: @survey
    else
      render json: @survey.errors, status: :unprocessable_entity
    end
  end

  # GET /surveys/1/redcap
  def redcap
    xml = render_to_string 'surveys/redcap.xml', layout: false
    send_data(xml, filename: "#{@survey.name.underscore}_redcap.xml",
                   type: 'application/xml',
                   status: 200)
  end

  private

  def can_survey_be_created?(survey)
    if survey.all_versions.count >= 1
      if survey.not_owned_or_in_group?(current_user)
        render(json: survey.errors, status: :unauthorized)
        return false
      elsif survey.all_versions.last.status == 'draft'
        render(json: survey.errors, status: :unprocessable_entity)
        return false
      end
      survey.version = survey.most_recent + 1
    end
    true
  end

  def load_supporting_resources_for_editing
    @sections = params[:search] ? Section.search(params[:search]) : Section.all
  end

  def save_message(survey)
    action = survey.version > 1 ? 'revised' : 'created'
    "Survey was successfully #{action}."
  end

  def survey_params
    params.require(:survey).permit(:name, :description, :status, :parent_id, :groups,
                                   :control_number, :version_independent_id, :created_by_id,
                                   concepts_attributes: [:id, :value, :display_name, :code_system])
  end

  def create_survey_sections
    survey_sections = []
    if params[:survey][:linked_sections]
      params[:survey][:linked_sections].each do |s|
        survey_sections << SurveySection.new(section_id: s[:section_id], position: s[:position])
      end
    end
    survey_sections
  end

  # !!! this algorithm assumes a section cannot appear twice on the same survey !!!
  # Only update survey sections that were changed
  def update_survey_sections
    updated_ss = []
    if params[:survey][:linked_sections]
      new_ss_hash = {}
      params[:survey][:linked_sections].each { |q| new_ss_hash[q[:section_id]] = q }
      # Be aware, wrapping this loop in a transaction improves perf by batching all the updates to be committed at once
      SurveySection.transaction do
        @survey.survey_sections.each do |old_section|
          if new_ss_hash.exclude? old_section.section_id
            old_section.destroy!
          else
            new_section = new_ss_hash.delete(old_section.section_id)
            if old_section.position != new_section[:position]
              old_section.position = new_section[:position]
              old_section.save!
            end
            updated_ss << old_section
          end
        end
      end
      # any new survey section still in this hash needs to be created
      new_ss_hash.each { |_id, f| updated_ss << SurveySection.new(section_id: f[:section_id], position: f[:position]) }
    end
    updated_ss
  end
end
