module Api
	class FormsController < ApplicationController
	respond_to :json

		def index
		end

		def show
			@form = Form.find(params[:id])
			render json: @form, serializer: FormSerializer
		end

	end
end