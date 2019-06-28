# rubocop:disable Metrics/LineLength
# rubocop:disable Metrics/MethodLength
# rubocop:disable Metrics/AbcSize

module Api
  class MetricsController < Api::ApplicationController
    include ActionController::Live
    respond_to :json

    def index
      response.headers['Content-Type'] = 'application/json'
      @@tracker.pageview(path: '/api/metrics/SDP-V', hostname: Settings.default_url_helper_host, title: 'API Generate Metrics')

      # Total number of objects in the system
      response.stream.write "[{\"response_set_count\": #{ResponseSet.all.count}, "
      response.stream.write "\"question_count\": #{Question.all.count}, "
      response.stream.write "\"section_count\": #{Section.all.count}, "
      response.stream.write "\"survey_count\": #{Survey.all.count}, "

      count_q = 0
      Question.all.each_with_index do |q, i|
        if q.sections.count > 1 || (q.sections.count == 1 && ((SectionNestedItem.where(nested_section_id: q.sections.first.id).count + SurveySection.where(section_id: q.sections.first.id).count) > 1))
          count_q += 1
        end
        # Keep connection alive while working
        response.stream.write ' ' if i % 50 == 0
      end

      count_rs = 0
      ResponseSet.all.each_with_index do |rs, i|
        if rs.sections.count > 1 || (rs.sections.count == 1 && ((SectionNestedItem.where(nested_section_id: rs.sections.first.id).count + SurveySection.where(section_id: rs.sections.first.id).count) > 1))
          count_rs += 1
        end
        response.stream.write ' ' if i % 50 == 0
      end

      count_s = 0
      Section.all.each_with_index do |s, i|
        if s.surveys.count > 1 || ((SectionNestedItem.where(nested_section_id: s.id).count + SurveySection.where(section_id: s.id).count) > 1)
          count_s += 1
        end
        response.stream.write ' ' if i % 50 == 0
      end
      # Number of objects being reused (i.e. if the same question is used on 5 surveys it counts as 1 question being reused)
      response.stream.write "\"response_set_reused\": #{count_rs}, "
      response.stream.write "\"question_reused\": #{count_q}, "
      response.stream.write "\"section_reused\": #{count_s}, "

      sp_count = 0
      SurveillanceProgram.all.map do |sp|
        sp_count += 1 if sp.surveys.count > 0
      end

      # Extensions
      response.stream.write "\"response_set_extensions\": #{ResponseSet.where.not(parent_id: nil).count}, "
      response.stream.write "\"question_extensions\": #{Question.where.not(parent_id: nil).count}, "
      response.stream.write "\"section_extensions\": #{Section.where.not(parent_id: nil).count}, "
      response.stream.write "\"survey_extensions\": #{Survey.where.not(parent_id: nil).count}, "

      # Preferred
      response.stream.write "\"response_set_preferred\": #{ResponseSet.where(preferred: true).count}, "
      response.stream.write "\"question_preferred\": #{Question.where(preferred: true).count}, "
      response.stream.write "\"section_preferred\": #{Section.where(preferred: true).count}, "
      response.stream.write "\"survey_preferred\": #{Survey.where(preferred: true).count}, "

      # OMB Approved Survey Count
      response.stream.write "\"omb_approved_survey\": #{Survey.all.select { |s| s.control_number.present? }.compact.count}, "

      # Number of groups
      response.stream.write "\"number_of_groups\": #{Group.all.count}, "

      # Number of Collaborating Author Groups with Surveys
      response.stream.write "\"number_of_collaborating_author_groups_with_surveys\": #{GroupsSurveys.select('DISTINCT group_id').count},"

      sdp_team = ['msq8@cdc.gov', 'ikk1@cdc.gov', 'oef1@cdc.gov', 'njj8@cdc.gov', 'lsj7@cdc.gov', 'nen8@cdc.gov', 'zoo3@cdc.gov', 'onk2@cdc.gov', 'wdd8@cdc.gov', 'oju3@cdc.gov', 'mpx1@cdc.gov', 'kff0@cdc.gov']
      other_users = User.all.map { |u| u.email if u.email && !sdp_team.include?(u.email) && u.email != 'admin@sdpv.local' }.compact
      response.stream.write "\"cdc_program_users\": #{other_users.count}, "
      response.stream.write "\"programs_with_content\": #{sp_count}}]"
    ensure
      response.stream.close
    end
  end
end
