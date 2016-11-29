module Api
	class FormsController < ApplicationController
	respond_to :json

		def show
			respond_with Form.find(params[:id])
		end
	end
end