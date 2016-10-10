class QuestionTypesController < ApplicationController
  load_and_authorize_resource

  def index
    @question_types = QuestionType.all
  end

  def new
    @question_type = QuestionType.new
  end

  def show
  end

  def edit
  end

  def update
    respond_to do |format|
      if @question_type.update(question_type_params)
        format.html { redirect_to @question_type, notice: 'Question Type was successfully updated' }
        format.json { render :show, status: :ok, location: @question_type }
      else
        format.html { render :new }
        format.json { render json @question_type.errors, status: :unprocessable_entity }
      end
    end
  end

  def create
    @question_type = QuestionType.new(question_type_params)
    respond_to do |format|
      if @question_type.save
        format.html { redirect_to @question_type, notice: 'Question Type was successfully created' }
        format.json { render :show, status: :created, location: @question_type }
      else
        format.html { render :new }
        format.json { render json @question_type.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @question_type.destroy
    respond_to do |format|
      format.html { redirect_to question_types_url, notice: 'Question Type was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  def question_type_params
    params.require(:question_type).permit(:name)
  end
end
