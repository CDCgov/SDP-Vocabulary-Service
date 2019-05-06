# rubocop:disable Metrics/LineLength
# rubocop:disable Metrics/MethodLength
# rubocop:disable Metrics/AbcSize
class MetricsController < ApplicationController
  include ActionController::Live

  def index
    response.headers['Content-Type'] = 'text/html'

    response.stream.write "\n\nMetrics:"

    response.stream.write "\n\nTotal number of objects in the system:"
    response.stream.write "\n-------"
    response.stream.write "\nResponse Sets: #{ResponseSet.all.count}"
    response.stream.write "\nQuestions: #{Question.all.count}"
    response.stream.write "\nSections: #{Section.all.count}"
    response.stream.write "\nSurveys: #{Survey.all.count}"

    response.stream.write "\n\nPrivate objects in the system:"
    response.stream.write "\n-------"
    response.stream.write "\nResponse Sets: #{ResponseSet.where(status: 'draft').count}"
    response.stream.write "\nQuestions: #{Question.where(status: 'draft').count}"
    response.stream.write "\nSections: #{Section.where(status: 'draft').count}"
    response.stream.write "\nSurveys: #{Survey.where(status: 'draft').count}"

    response.stream.write "\n\nPublic objects in the system:"
    response.stream.write "\n-------"
    response.stream.write "\nResponse Sets: #{ResponseSet.where(status: 'published').count}"
    response.stream.write "\nQuestions: #{Question.where(status: 'published').count}"
    response.stream.write "\nSections: #{Section.where(status: 'published').count}"
    response.stream.write "\nSurveys: #{Survey.where(status: 'published').count}"

    count_q = 0
    Question.all.each_with_index do |q, i|
      if q.sections.count > 1 || (q.sections.count == 1 && ((SectionNestedItem.where(nested_section_id: q.sections.first.id).count + SurveySection.where(section_id: q.sections.first.id).count) > 1))
        count_q += 1
      end
      # Keep connection alive while working
      response.stream.write ' ' if i % 50 == 0
    end

    response.stream.write "\n\nNumber of objects being reused (i.e. if the same question is used on 5 surveys it counts as 1 question being reused):"
    response.stream.write "\n-------"

    count_rs = 0
    ResponseSet.all.each_with_index do |rs, i|
      if rs.sections.count > 1 || (rs.sections.count == 1 && ((SectionNestedItem.where(nested_section_id: rs.sections.first.id).count + SurveySection.where(section_id: rs.sections.first.id).count) > 1))
        count_rs += 1
      end
      response.stream.write ' ' if i % 50 == 0
    end

    response.stream.write "\nResponse Sets: #{count_rs}"
    response.stream.write "\nQuestions: #{count_q}"

    count_s = 0
    Section.all.each_with_index do |s, i|
      if s.surveys.count > 1 || ((SectionNestedItem.where(nested_section_id: s.id).count + SurveySection.where(section_id: s.id).count) > 1)
        count_s += 1
      end
      response.stream.write ' ' if i % 50 == 0
    end

    response.stream.write "\nSections: #{count_s}"

    user_info = User.all.map { |u| " #{u.email}, Program: #{u.last_program ? u.last_program.name : 'None'}, Sign in Count: #{u.sign_in_count} " }

    sp_count = 0
    sp_names = SurveillanceProgram.all.map do |sp|
      if sp.surveys.count > 0
        sp_count += 1
        sp.name
      end
    end
    sp_names = sp_names.compact

    response.stream.write "\n\nExtensions:"
    response.stream.write "\n-------"
    response.stream.write "\nResponse Sets: #{ResponseSet.where.not(parent_id: nil).count}"
    response.stream.write "\nQuestions: #{Question.where.not(parent_id: nil).count}"
    response.stream.write "\nSections: #{Section.where.not(parent_id: nil).count}"
    response.stream.write "\nSurveys: #{Survey.where.not(parent_id: nil).count}"

    response.stream.write "\n\nPreferred:"
    response.stream.write "\n-------"
    response.stream.write "\nResponse Sets: #{ResponseSet.where(preferred: true).count}"
    response.stream.write "\nQuestions: #{Question.where(preferred: true).count}"
    response.stream.write "\nSection: #{Section.where(preferred: true).count}"
    response.stream.write "\nSurvey: #{Survey.where(preferred: true).count}"

    response.stream.write "\n\nOMB Approved Survey Count: #{Survey.all.select { |s| s.control_number.present? }.compact.count}"

    response.stream.write "\n\nNumber of groups: #{Group.all.count}"
    response.stream.write "\n\nDuplicates Replaced:"
    response.stream.write "\n-------"
    rs_sum = 0
    q_sum = 0
    Question.where.not(duplicates_replaced_count: 0).each { |q| q_sum += q.duplicates_replaced_count }
    ResponseSet.where.not(duplicates_replaced_count: 0).each { |rs| rs_sum += rs.duplicates_replaced_count }
    response.stream.write "\nResponse Sets: #{rs_sum}"
    response.stream.write "\nQuestions: #{q_sum}"

    response.stream.write "\n\nUser Info:"
    response.stream.write "\n-------\n"
    user_info.each { |u| response.stream.write u }
    # admin_users = User.all.map { |u| u.email if u.admin? }.compact

    response.stream.write "\n\nAdmins: 1"
    response.stream.write "\n-------\n"
    response.stream.write 'admin@sdpv.local'

    sdp_team = ['msq8@cdc.gov', 'ikk1@cdc.gov', 'oef1@cdc.gov', 'njj8@cdc.gov', 'lsj7@cdc.gov', 'nen8@cdc.gov', 'zoo3@cdc.gov', 'onk2@cdc.gov', 'wdd8@cdc.gov', 'oju3@cdc.gov', 'mpx1@cdc.gov', 'kff0@cdc.gov']
    response.stream.write "\n\nSDP Team: #{sdp_team.count}"
    response.stream.write "\n-------\n"
    sdp_team.map { |u| response.stream.write "#{u}, " }

    other_users = User.all.map { |u| u.email if u.email && !sdp_team.include?(u.email) && u.email != 'admin@sdpv.local' }.compact
    response.stream.write "\n\nCDC Program Users: #{other_users.count}"
    response.stream.write "\n-------\n"
    other_users.map { |u| response.stream.write "#{u}, " }

    response.stream.write "\n\nPrograms with content in the system: #{sp_count}"
    response.stream.write "\n-------\n"
    sp_names.map { |u| response.stream.write "#{u}, " }
  ensure
    response.stream.close
  end
end
