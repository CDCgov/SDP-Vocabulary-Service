# rubocop:disable Metrics/LineLength
# rubocop:disable Metrics/AbcSize

module Api
  class SectionsController < Api::ApplicationController
    respond_to :json

    def index
      @@tracker.pageview(path: "/api/sections/#{params[:limit]}", hostname: Settings.default_url_helper_host, title: 'API Section Show - Search criteria: ' + params[:search].to_s)
      @sections = if params[:search]
                    Section.includes(:published_by, section_nested_items: [{ response_set: :responses }, :question, :nested_section]).search(params[:search])
                  else
                    Section.includes(:published_by, section_nested_items: [{ response_set: :responses }, :question, :nested_section]).all
                  end
      current_user_id = current_user ? current_user.id : -1
      @sections = if params[:limit] && (params[:limit].to_i < 100 || request.env['HTTP_ACCEPT_ENCODING'] == 'gzip')
                    @sections.limit(params[:limit].to_i).where("(status='published' OR created_by_id= ?)", current_user_id)
                  else
                    @sections.limit(100).where("(status='published' OR created_by_id= ?)", current_user_id)
                  end
      @sections = @sections.order(version_independent_id: :asc)
      render json: @sections, each_serializer: SectionSerializer
    end

    def show
      @section = Section.includes(:published_by, section_nested_items: [{ response_set: :responses },
                                                                        :question, :nested_section]).by_id_and_version(params[:id].upcase, params[:version])
      if @section.nil?
        @@tracker.pageview(path: "/api/sections/#{params[:id]}/#{params[:version]}", hostname: Settings.default_url_helper_host, title: 'API Section Not Found')
        not_found
        return
      else
        @@tracker.pageview(path: "/api/sections/#{params[:id]}/#{params[:version]}", hostname: Settings.default_url_helper_host, title: 'API Section Show')
        render json: @section, serializer: SectionSerializer
      end
    end

    def usage
      @section = Section.by_id_and_version(params[:id].upcase, params[:version])
      if @section.nil?
        not_found
        return
      end
      render json: @section, serializer: UsageSerializer
    end
  end
end
