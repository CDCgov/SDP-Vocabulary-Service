class SurveysController < ApplicationController
  load_and_authorize_resource except: [:create]
  def index
    @surveys = Survey.includes([:created_by, :survey_forms, :forms]).all
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
        @survey.surveillance_system  = current_user.last_system
        @survey.surveillance_program = current_user.last_program
        @survey.survey_forms = update_survey_forms
        @survey.update_concepts('Survey')
        update_successful = @survey.update(form_params)
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
    params.require(:survey).permit(:name, :description, :status, :parent_id,
                                   :control_number, :version_independent_id, :created_by_id,
                                   concepts_attributes: [:id, :value, :display_name, :code_system])
  end

  def create_survey_forms
    survey_forms = []
    if params[:survey][:linked_forms]
      params[:survey][:linked_forms].each do |f|
        survey_forms << SurveyForm.new(form_id: f[:form_id], position: f[:position])
      end
    end
    survey_forms
  end

  # !!! this algorithm assumes a form cannot appear twice on the same survey !!!
  # Only update survey forms that were changed
  def update_survey_forms
    updated_fs = []
    if params[:survey][:linked_forms]
      new_fs_hash = {}
      params[:survey][:linked_forms].each { |q| new_fs_hash[q[:form_id]] = q }
      # Be aware, wrapping this loop in a transaction improves performance by batching all the updates to be committed at once
      SurveyForm.transaction do
        @survey.survey_forms.each do |old_form|
          if new_fs_hash.exclude? old_form.form_id
            old_form.destroy!
          else
            new_form = new_fs_hash.delete(old_form.form_id)
            if old_form.position != new_form[:position]
              old_form.position = new_form[:position]
              old_form.save!
            end
            updated_fs << old_form
          end
        end
      end
      # any new survey form still in this hash needs to be created
      new_fs_hash.each { |_id, f| updated_fs << SurveyForm.new(form_id: f[:form_id], position: f[:position]) }
    end
    updated_fs
  end
end
