require './lib/sdp/elastic_search'
require 'savon'

class SurveysController < ApplicationController
  before_action :load_survey_with_children, only: :show
  load_and_authorize_resource
  before_action :set_paper_trail_whodunnit

  def info_for_paper_trail
    comment = request.params[:comment] || ''
    association_changes = request.params[:association_changes] || {}
    { comment: comment, associations: association_changes }
  end

  def index
    @users = User.all
  end

  def show
  end

  def new
    @survey = Survey.new
    load_supporting_resources_for_editing
  end

  def create
    @survey = Survey.new(survey_params)
    return unless can_survey_be_created?(@survey)
    @survey.created_by = current_user
    @survey.survey_sections = create_survey_sections
    if @survey.save
      render :show, status: :created, location: @survey
    else
      render json: @survey.errors, status: :unprocessable_entity
    end
  end

  def update
    if @survey.status == 'published'
      render json: { status: ' Published surveys cannot be updated.' }, status: :unprocessable_entity
    else
      update_successful = nil
      @survey.transaction do
        @survey.minor_change_count += 1 if params[:unsaved_state]
        @survey.survey_sections = update_survey_sections
        @survey.update_concepts('Survey')
        update_successful = @survey.update(survey_params)
      end
      if update_successful
        @survey.groups.each do |group|
          @survey.add_to_group(group.id)
        end
        render json: @survey.to_json, status: :ok
      else
        render json: @survey.errors, status: :unprocessable_entity
      end
    end
  end

  def destroy
    if @survey.status == 'draft'
      if params[:cascade] == 'true'
        @survey.cascading_action do |element|
          element.destroy if element.status == 'draft' && element.exclusive_use?
        end
      end
      @survey.destroy
      render json: @survey
    else
      render json: @survey.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /surveys/1/publish
  def publish
    if @survey.status == 'draft'
      if @current_user.publisher?
        @survey.publish(@current_user)
        render :show
      else
        render json: @survey.errors, status: :forbidden
      end

    else
      render json: @survey.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /surveys/1/publish
  def publish_web
    client = Savon.client(
      wsdl: 'http://www.cstesurvey.org/EpiInfoWebSurvey/SurveyManagerServiceV3.svc?wsdl',
      log: true, log_level: :debug, pretty_print_xml: true, namespaces: {
        'xmlns:typ' => 'http://www.yourcompany.com/types/',
        'xmlns:epi' => 'http://schemas.datacontract.org/2004/07/Epi.Web.Common.DTO'
      }
    )
    @tab_counter = 0
    @top = -0.03
    xml = render_to_string 'surveys/epi_info.xml', layout: false
    pubkey = SecureRandom.uuid
    # Put XML body in request once client debugged
    resp = client.call(:publish_survey, message: {
                         'tns:pRequestMessage' => {
                           'typ:SurveyInfo' => {
                             'typ:ClosingDate' => (Time.zone.now + (60 * 60 * 24 * 30)).strftime('%FT%T%:z'),
                             'typ:ExitText' => 'Thank you!', 'typ:IntroductionText' => 'Welcome!',
                             'typ:IsDraftMode' => true,
                             'typ:OrganizationKey' => params['org'],
                             'typ:StartDate' => (Time.zone.now - (60 * 60 * 24)).strftime('%FT%T%:z'),
                             'typ:SurveyName' => @survey.name, 'typ:SurveyNumber' => @survey.id,
                             'typ:SurveyType' => 1,
                             'typ:UserPublishKey' => pubkey,
                             'typ:XML' => xml
                           }
                         }
                       })
    url = resp.body[:publish_survey_response][:publish_survey_result][:publish_info][:url]
    @survey.ei_pub_key = pubkey
    @survey.ei_org_key = params['org']
    @survey.ei_url = url
    @survey.save!
    render json: { msg: 'Successfully created web survey:', url: url, pubkey: pubkey }, status: :ok
  rescue
    # Replace with status text eventually resp['StatusText']
    render json: { msg: 'An Error has occured while publishing your survey.' }, status: :unprocessable_entity
  end

  # PATCH/PUT /surveys/1/retire
  def retire
    if @survey.status == 'published'
      if @current_user.publisher?
        @survey.retire
        render :show
      else
        render json: @survey.errors, status: :forbidden
      end
    else
      render json: @survey.errors, status: :unprocessable_entity
    end
  end

  def update_stage
    if ['Published', 'Draft', 'Comment Only', 'Trial Use'].include?(params[:stage])
      @survey.update_stage(params[:stage])
      render :show, status: :ok, location: @survey
    else
      render json: @survey.errors, status: :unprocessable_entity
    end
  end

  def add_to_group
    group = Group.find(params[:group])
    if current_user.groups.include?(group)
      @survey.add_to_group(params[:group])
      render :show
    else
      render json: { msg: 'Error adding item - you do not have permissions in that group' }, status: :unprocessable_entity
    end
  end

  def remove_from_group
    group = Group.find(params[:group])
    if current_user.groups.include?(group)
      @survey.remove_from_group(params[:group])
      render :show
    else
      render json: { msg: 'Error adding item - you do not have permissions in that group' }, status: :unprocessable_entity
    end
  end

  def update_tags
    @survey.tag_list = params['tag_list']
    if params['tag_list'] && @survey.save!
      render :show, status: :ok, location: @survey
    else
      render json: @survey.errors, status: :unprocessable_entity
    end
  end

  # GET /surveys/1/duplicates
  def duplicate_count
    if ::SDP::Elasticsearch.ping
      render json: @survey.q_with_dupes_count(current_user), status: :ok
    else
      render json: { msg: 'Request cannot be processed as Elasticsearch appears to be down.' }, status: :unprocessable_entity
    end
  end

  # GET /surveys/1/duplicates
  def duplicates
    if ::SDP::Elasticsearch.ping
      render json: @survey.potential_duplicates(current_user), status: :ok
    else
      render json: { msg: 'Request cannot be processed as Elasticsearch appears to be down.' }, status: :unprocessable_entity
    end
  end

  # GET /surveys/1/redcap
  def redcap
    xml = render_to_string 'surveys/redcap.xml', layout: false
    send_data(xml, filename: "#{@survey.name.parameterize.underscore}_redcap.xml",
                   type: 'application/xml',
                   status: 200)
  end

  # GET /surveys/1/epi_info
  def epi_info
    @tab_counter = 0
    @top = -0.03
    xml = render_to_string 'surveys/epi_info.xml', layout: false
    send_data(xml, filename: "#{@survey.name.parameterize.underscore}_epi_info.xml",
                   type: 'application/xml',
                   status: 200)
  end

  def spreadsheet
    @survey = Survey.find(params[:id])
    render xlsx: "#{@survey.name.parameterize.underscore}_spreadsheet", template: 'surveys/generic_spreadsheet.xlsx.axlsx'
  end

  private

  def load_survey_with_children
    @survey = Survey.includes(sections: [:groups]).find(params[:id])
  end

  def can_survey_be_created?(survey)
    if survey.all_versions.count >= 1
      if survey.not_owned_or_in_group?(current_user)
        render(json: survey.errors, status: :unauthorized)
        return false
      elsif survey.all_versions.last.status == 'draft'
        render(json: survey.errors, status: :unprocessable_entity)
        return false
      end
      survey.version = survey.most_recent + 1
    end
    true
  end

  def load_supporting_resources_for_editing
    @sections = params[:search] ? Section.search(params[:search]) : Section.all
  end

  def save_message(survey)
    action = survey.version > 1 ? 'revised' : 'created'
    "Survey was successfully #{action}."
  end

  def survey_params
    params.require(:survey).permit(:name, :description, :parent_id, :groups,
                                   :control_number, :omb_approval_date, :version_independent_id,
                                   :surveillance_program_id, :surveillance_system_id, tag_list: [],
                                                                                      concepts_attributes: [:id, :value, :display_name, :code_system])
  end

  def create_survey_sections
    survey_sections = []
    if params[:survey][:linked_sections]
      params[:survey][:linked_sections].each do |s|
        survey_sections << SurveySection.new(section_id: s[:section_id], position: s[:position])
      end
    end
    survey_sections
  end

  # !!! this algorithm assumes a section cannot appear twice on the same survey !!!
  # Only update survey sections that were changed
  def update_survey_sections
    updated_ss = []
    if params[:survey][:linked_sections]
      new_ss_hash = {}
      params[:survey][:linked_sections].each { |q| new_ss_hash[q[:section_id]] = q }
      # Be aware, wrapping this loop in a transaction improves perf by batching all the updates to be committed at once
      SurveySection.transaction do
        @survey.survey_sections.each do |old_section|
          if new_ss_hash.exclude? old_section.section_id
            old_section.destroy!
          else
            new_section = new_ss_hash.delete(old_section.section_id)
            if old_section.position != new_section[:position]
              old_section.position = new_section[:position]
              old_section.save!
            end
            updated_ss << old_section
          end
        end
      end
      # any new survey section still in this hash needs to be created
      new_ss_hash.each { |_id, f| updated_ss << SurveySection.new(section_id: f[:section_id], position: f[:position]) }
    end
    updated_ss
  end
end
