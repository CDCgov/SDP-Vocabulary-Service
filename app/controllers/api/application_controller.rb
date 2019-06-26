module Api
  class ApplicationController < ActionController::Base
    protect_from_forgery with: :exception
    rescue_from Exception do |e|
      error(e)
    end

    protected

    def error(e)
      error_info = {
        message: 'internal-server-error',
        exception: "#{e.class.name} : #{e.message}"
      }
      render json: error_info.to_json, status: 500
    end

    def not_found
      render json: { message: 'Resource Not Found' }, status: 404
    end
  end
end
