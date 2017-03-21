class SurveysController < ApplicationController
  load_and_authorize_resource
  def index
    @surveys = Survey.latest_versions
    @users = User.all
  end

  def show
  end

  def new
    @form = Form.new
    load_supporting_resources_for_editing
  end

  def create
    @survey = Survey.new(form_params)
    @survey.created_by = current_user
    @survey_forms = create_survey_forms
    if @survey.save
      render :show, status: :created, location: @survey
    else
      render json: @survey.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @survey.survey_forms.destroy_all
    @survey.destroy
    render json: @survey, status: :ok && return
  end

  private

  def load_supporting_resources_for_editing
    @forms = params[:search] ? Form.search(params[:search]) : Form.all
  end

  def save_message(survey)
    action = survey.version > 1 ? 'revised' : 'created'
    "Survey was successfully #{action}."
  end

  def form_params
    params.require(:survey).permit(:name, :control_number, :version_independent_id)
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
