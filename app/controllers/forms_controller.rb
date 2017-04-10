class FormsController < ApplicationController
  load_and_authorize_resource

  # GET /forms
  # GET /forms.json
  def index
    @forms = params[:search] ? Form.search(params[:search]).all : Form.all
    @users = User.all
  end

  def my_forms
    @forms = params[:search] ? Form.owned_by(current_user.id).search(params[:search]).latest_versions : Form.owned_by(current_user.id).latest_versions
    render action: :index, collection: @forms
  end

  # GET /forms/1
  # GET /forms/1.json
  def show
  end

  # GET /forms/new
  def new
    @form = Form.new
    load_supporting_resources_for_editing
  end

  # GET /forms/1/export
  def export
    @form = Form.find(params[:id])
  end

  # POST /forms
  # POST /forms.json
  def create
    @form = Form.new(form_params)
    return unless can_form_be_created?(@form)
    @form.created_by = current_user
    @form.form_questions = create_form_questions
    if @form.save
      render :show, status: :created, location: @form
    else
      render json: @form.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /forms/1
  # PATCH/PUT /forms/1.json
  def update
    if @form.status == 'published'
      render json: { status: 'Published forms cannot be updated.' }, status: :unprocessable_entity
    else
      update_successful = nil
      @form.transaction do
        # @form.updated_by = current_user
        @form.form_questions.destroy_all
        @form.form_questions = create_form_questions
        # When we assign update_successful, it is the last expression in the block
        # That means, if the form fails to update, this block will return false,
        # which will cause the transaction to rollback.
        # Otherwise, we have killed all FormQuestions, without replacing them.
        update_successful = @form.update(form_params)
      end
      if update_successful
        render :show, status: :ok, location: @form
      else
        render json: @form.errors, status: :unprocessable_entity
      end
    end
  end

  # DELETE /forms/1
  # DELETE /forms/1.json
  def destroy
    if @form.status == 'draft'
      @form.questions.destroy_all
      @form.surveys.destroy_all
      @form.destroy
      render json: @form
    else
      render json: @form.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /forms/1/publish
  def publish
    if @form.status == 'draft'
      @form.publish
      render :show
    else
      render json: @form.errors, status: :unprocessable_entity
    end
  end

  # GET /forms/1/redcap
  def redcap
    xml = render_to_string 'forms/redcap.xml', layout: false
    send_data(xml, filename: "#{@form.name.underscore}_redcap.xml",
                   type: 'application/xml',
                   status: 200)
  end

  private

  def can_form_be_created?(form)
    if form.all_versions.count >= 1
      if form.all_versions.last.created_by != current_user
        render(json: form.errors, status: :unauthorized)
        return false
      elsif form.all_versions.last.status == 'draft'
        render(json: form.errors, status: :unprocessable_entity)
        return false
      end
      form.version = form.most_recent + 1
    end
    true
  end

  def load_supporting_resources_for_editing
    @questions = params[:search] ? Question.search(params[:search]) : Question.all
    @response_sets = ResponseSet.latest_versions
  end

  def save_message(form)
    action = form.version > 1 ? 'revised' : 'created'
    "Form was successfully #{action}."
  end

  def create_form_questions
    question_ids = params[:form][:linked_questions]
    response_set_ids = params[:form][:linked_response_sets]
    form_questions = []
    if question_ids
      position = 0
      question_ids.zip(response_set_ids).each do |qid, rsid|
        rsid = nil if rsid == ''
        form_questions << FormQuestion.new(question_id: qid, response_set_id: rsid, position: position)
        position += 1
      end
    end
    form_questions
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def form_params
    params.require(:form).permit(:name, :user_id, :search, :description,
                                 :status, :version_independent_id, :control_number)
  end
end
