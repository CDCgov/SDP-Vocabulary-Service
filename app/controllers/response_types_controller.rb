class ResponseTypesController < ApplicationController
  def index
    render json: ResponseType.all
  end
end
