class PublicInfoController < ApplicationController
  def index
    object = params[:type].constantize.find(params[:id])
    if object && current_user
      author = { name: object.created_by.full_name, email: object.created_by.email }
      temp = { name: object.name || object.content, author: author }
      render json: object.to_json, status: :ok
    elsif object
      temp = { name: object.name || object.content }
      render json: object.to_json, status: :ok
    else
      render json: { msg: "Couldn't find #{params[:type]} with id #{params[:id]}" }, status: :unprocessable_entity
  end
end
