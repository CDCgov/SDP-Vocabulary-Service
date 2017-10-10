class FormsController < ApplicationController
  load_and_authorize_resource

  # GET /forms
  # GET /forms.json
  def index
    @users = User.all
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
        @form.form_questions = update_form_questions
        @form.update_concepts('Form')
        # When we assign update_successful, it is the last expression in the block
        # That means, if the form fails to update, this block will return false,
        # which will cause the transaction to rollback.
        update_successful = @form.update(form_params)
      end
      if update_successful
        render json: @form.to_json, status: :ok
      else
        render json: @form.errors, status: :unprocessable_entity
      end
    end
  end

  # DELETE /forms/1
  # DELETE /forms/1.json
  def destroy
    if @form.status == 'draft'
      @form.destroy
      SDP::Elasticsearch.delete_item('form', @form.id, true)
      render json: @form
    else
      render json: @form.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /forms/1/publish
  def publish
    if @form.status == 'draft'
      @form.publish(current_user)
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
    form_questions = []
    if params[:form][:linked_questions]
      params[:form][:linked_questions].each do |q|
        form_questions << FormQuestion.new(question_id: q[:question_id], response_set_id: q[:response_set_id],\
                                           position: q[:position], program_var: q[:program_var])
      end
    end
    form_questions
  end

  # old_q is a FormQuestion, new_q is hash representing a new form question from the request params
  def update_form_question(old_q, new_q)
    old_q.position = new_q[:position]
    old_q.program_var = new_q[:program_var]
    old_q.question_id = new_q[:question_id]
    old_q.response_set_id = new_q[:response_set_id]
    # While this seems unecessary, checking changed? here improves performance
    old_q.save! if old_q.changed?
    old_q
  end

  # !!! this algorithm assumes a question cannot appear twice on the same form !!!
  # Only update form questions that were changed
  def update_form_questions
    updated_qs = []
    if params[:form][:linked_questions]
      new_qs_hash = {}
      params[:form][:linked_questions].each { |q| new_qs_hash[q[:question_id]] = q }
      # Be aware, wrapping this loop in a transaction improves performance by batching all the updates to be committed at once
      FormQuestion.transaction do
        @form.form_questions.each do |q|
          if new_qs_hash.include? q.question_id
            updated_qs << update_form_question(q, new_qs_hash.delete(q.question_id))
          else
            q.destroy!
          end
        end
      end
      # any new form question still in this hash needs to be created
      new_qs_hash.each do |_id, q|
        updated_qs << FormQuestion.new(question_id: q[:question_id], response_set_id: q[:response_set_id],\
                                       position: q[:position], program_var: q[:program_var])
      end
    end
    updated_qs
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def form_params
    params.require(:form).permit(:name, :user_id, :search, :description, :parent_id,
                                 :status, :version_independent_id, :control_number,
                                 concepts_attributes: [:id, :value, :display_name, :code_system])
  end
end
