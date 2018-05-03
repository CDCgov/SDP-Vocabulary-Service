require 'sdp/elastic_search'

module Admin
  class PreferredContentController < AdminController
    def add_preferred_label
      object = params[:type].constantize.find(params[:id])
      if object
        object.preferred = true
        object.save!
        UpdateIndexJob.perform_later(object.class.to_s.underscore, object.id)
        render json: object.to_json, status: :ok
      else
        render json: { msg: "Couldn't find #{params[:type]} with id #{params[:id]}" }, status: :unprocessable_entity
      end
    end

    def remove_preferred_label
      object = params[:type].constantize.find(params[:id])
      if object
        object.preferred = false
        object.save!
        UpdateIndexJob.perform_later(object.class.to_s.underscore, object.id)
        render json: object.to_json, status: :ok
      else
        render json: { msg: "Couldn't find #{params[:type]} with id #{params[:id]}" }, status: :unprocessable_entity
      end
    end
  end
end
