class SurveysController < ApplicationController
  load_and_authorize_resource except: [:create]
  def index
    @surveys = Survey.all
    @users = User.all
  end

  def show
  end

  def new
    @survey = Survey.new
    load_supporting_resources_for_editing
  end

  def create
    @survey = Survey.new(form_params)
    return unless can_survey_be_created?(@survey)
    @survey.created_by = current_user
    @survey.surveillance_system = current_user.last_system
    @survey.surveillance_program = current_user.last_program
    @survey.survey_forms = create_survey_forms
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
        @survey.surveillance_system = current_user.last_system
        @survey.surveillance_program = current_user.last_program
        @survey.survey_forms.destroy_all
        @survey.survey_forms = create_survey_forms

        update_successful = @survey.update(form_params)
      end
      if update_successful
        render :show, status: :ok, location: @survey
      else
        render json: @survey.errors, status: :unprocessable_entity
      end
    end
  end

  def destroy
    if @survey.status == 'draft'
      @survey.forms.destroy_all
      @survey.destroy
      render json: @survey
    else
      render json: @survey.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /surveys/1/publish
  def publish
    if @survey.status == 'draft'
      if @current_user.has_role?(:publisher)
        @survey.publish(@current_user)
        render :show
      else
        render json: @survey.errors, status: :forbidden
      end

    else
      render json: @survey.errors, status: :unprocessable_entity
    end
  end

  private

  def can_survey_be_created?(survey)
    if survey.all_versions.count >= 1
      if survey.all_versions.last.created_by != current_user
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
    @forms = params[:search] ? Form.search(params[:search]) : Form.all
  end

  def save_message(survey)
    action = survey.version > 1 ? 'revised' : 'created'
    "Survey was successfully #{action}."
  end

  def form_params
    params.require(:survey).permit(:name, :description, :status,
                                   :control_number, :version_independent_id, :created_by_id)
  end

  def create_survey_forms
    form_ids = params[:survey][:linked_forms]
    survey_forms = []
    if form_ids
      form_ids.each_with_index do |f, i|
        survey_forms << SurveyForm.new(form_id: f, position: i)
      end
    end
    survey_forms
  end
end
