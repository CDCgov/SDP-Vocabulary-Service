class PublicInfoController < ApplicationController
  def index
    object = params[:type].constantize.find(params[:id])
    if object && current_user
      author = { name: object.created_by.full_name, email: object.created_by.email }
      name = object.content if params[:type] == 'Question'
      temp = { name: name || object.name, author: author }
      render json: temp.to_json, status: :ok
    elsif object
      name = object.content if params[:type] == 'Question'
      temp = { name: name || object.name }
      render json: temp.to_json, status: :ok
    else
      render json: { msg: "Couldn't find #{params[:type]} with id #{params[:id]}" }, status: :unprocessable_entity
    end
  end
end
