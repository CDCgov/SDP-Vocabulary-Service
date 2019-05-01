# rubocop:disable Metrics/LineLength
# rubocop:disable Metrics/MethodLength
# rubocop:disable Metrics/AbcSize

module Api
  class MetricsController < Api::ApplicationController
    respond_to :json

    def index
      metrics_json = {}
      count_q = 0
      Question.all.map do |q|
        if q.sections.count > 1 || (q.sections.count == 1 && ((SectionNestedItem.where(nested_section_id: q.sections.first.id).count + SurveySection.where(section_id: q.sections.first.id).count) > 1))
          count_q += 1
        end
      end

      count_rs = 0
      ResponseSet.all.map do |rs|
        if rs.sections.count > 1 || (rs.sections.count == 1 && ((SectionNestedItem.where(nested_section_id: rs.sections.first.id).count + SurveySection.where(section_id: rs.sections.first.id).count) > 1))
          count_rs += 1
        end
      end

      count_s = 0
      Section.all.map do |s|
        if s.surveys.count > 1 || ((SectionNestedItem.where(nested_section_id: s.id).count + SurveySection.where(section_id: s.id).count) > 1)
          count_s += 1
        end
      end

      sp_count = 0
      SurveillanceProgram.all.map do |sp|
        if sp.surveys.count > 0
          sp_count += 1
          sp.name
        end
      end

      # Total number of objects in the system
      metrics_json['response_set_count'] = ResponseSet.all.count
      metrics_json['question_count'] = Question.all.count
      metrics_json['section_count'] = Section.all.count
      metrics_json['survey_count'] = Survey.all.count

      # Number of objects being reused (i.e. if the same question is used on 5 surveys it counts as 1 question being reused)
      metrics_json['response_set_reused'] = count_rs
      metrics_json['question_reused'] = count_q
      metrics_json['section_reused'] = count_s

      # Extensions
      metrics_json['response_set_extensions'] = ResponseSet.where.not(parent_id: nil).count
      metrics_json['question_extensions'] = Question.where.not(parent_id: nil).count
      metrics_json['section_extensions'] = Section.where.not(parent_id: nil).count
      metrics_json['survey_extensions'] = Survey.where.not(parent_id: nil).count

      # Preferred
      metrics_json['response_set_preferred'] = ResponseSet.where(preferred: true).count
      metrics_json['question_preferred'] = Question.where(preferred: true).count
      metrics_json['section_preferred'] = Section.where(preferred: true).count
      metrics_json['survey_preferred'] = Survey.where(preferred: true).count

      # OMB Approved Survey Count
      metrics_json['omb_approved_survey'] = Survey.all.select { |s| s.control_number.present? }.compact.count

      # Number of groups
      metrics_json['number_of_groups'] = Group.all.count

      sdp_team = ['msq8@cdc.gov', 'ikk1@cdc.gov', 'oef1@cdc.gov', 'njj8@cdc.gov', 'lsj7@cdc.gov', 'nen8@cdc.gov', 'zoo3@cdc.gov', 'onk2@cdc.gov', 'wdd8@cdc.gov', 'oju3@cdc.gov', 'mpx1@cdc.gov', 'kff0@cdc.gov']

      other_users = User.all.map { |u| u.email if u.email && !sdp_team.include?(u.email) && u.email != 'admin@sdpv.local' }.compact
      metrics_json['cdc_program_users'] = other_users.count.to_s

      metrics_json['programs_with_content'] = sp_count.to_s

      render json: metrics_json
    end
  end
end
