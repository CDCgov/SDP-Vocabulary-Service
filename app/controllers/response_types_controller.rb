class ResponseTypesController < ApplicationController
  def index
    render json: ResponseType.all.order(name: :asc)
  end
end
