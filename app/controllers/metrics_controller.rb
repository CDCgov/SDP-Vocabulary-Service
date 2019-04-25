class MetricsController < ApplicationController

  def index
    metrics = ''
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

    user_info = User.all.map { |u| " #{u.email}, Program: #{u.last_program ? u.last_program.name : 'None'}, Sign in Count: #{u.sign_in_count} " }

    sp_count = 0
    sp_names = SurveillanceProgram.all.map do |sp|
      if sp.surveys.count > 0
        sp_count += 1
        sp.name
      end
    end
    sp_names = sp_names.compact

    metrics << "\n\nMetrics:"

    metrics << "\n\nTotal number of objects in the system:"
    metrics << "\n-------"
    metrics << "\nResponse Sets: #{ResponseSet.all.count}"
    metrics << "\nQuestions: #{Question.all.count}"
    metrics << "\nSections: #{Section.all.count}"
    metrics << "\nSurveys: #{Survey.all.count}"

    metrics << "\n\nPrivate objects in the system:"
    metrics << "\n-------"
    metrics << "\nResponse Sets: #{ResponseSet.where(status: 'draft').count}"
    metrics << "\nQuestions: #{Question.where(status: 'draft').count}"
    metrics << "\nSections: #{Section.where(status: 'draft').count}"
    metrics << "\nSurveys: #{Survey.where(status: 'draft').count}"

    metrics << "\n\nPublic objects in the system:"
    metrics << "\n-------"
    metrics << "\nResponse Sets: #{ResponseSet.where(status: 'published').count}"
    metrics << "\nQuestions: #{Question.where(status: 'published').count}"
    metrics << "\nSections: #{Section.where(status: 'published').count}"
    metrics << "\nSurveys: #{Survey.where(status: 'published').count}"

    metrics << "\n\nNumber of objects being reused (i.e. if the same question is used on 5 surveys it counts as 1 question being reused):"
    metrics << "\n-------"
    metrics << "\nResponse Sets: #{count_rs}"
    metrics << "\nQuestions: #{count_q}"
    metrics << "\nSections: #{count_s}"

    metrics << "\n\nExtensions:"
    metrics << "\n-------"
    metrics << "\nResponse Sets: #{ResponseSet.where.not(parent_id: nil).count}"
    metrics << "\nQuestions: #{Question.where.not(parent_id: nil).count}"
    metrics << "\nSections: #{Section.where.not(parent_id: nil).count}"
    metrics << "\nSurveys: #{Survey.where.not(parent_id: nil).count}"

    metrics << "\n\nPreferred:"
    metrics << "\n-------"
    metrics << "\nQuestions: #{Question.where(preferred: true).count}"
    metrics << "\nResponse Sets: #{ResponseSet.where(preferred: true).count}"

    metrics << "\n\nOMB Approved Survey Count: #{Survey.all.select { |s| s.control_number.present? }.compact.count}"

    metrics << "\n\nNumber of groups: #{Group.all.count}"
    metrics << "\n\nDuplicates Replaced:"
    metrics << "\n-------"
    rs_sum = 0
    q_sum = 0
    Question.where.not(duplicates_replaced_count: 0).each { |q| q_sum += q.duplicates_replaced_count }
    ResponseSet.where.not(duplicates_replaced_count: 0).each { |rs| rs_sum += rs.duplicates_replaced_count }
    metrics << "\nResponse Sets: #{rs_sum}"
    metrics << "\nQuestions: #{q_sum}"

    metrics << "\n\nUser Info:"
    metrics << "\n-------"
    user_info.each { |u| metrics << u }
    # admin_users = User.all.map { |u| u.email if u.admin? }.compact

    metrics << "\n\nAdmins: 1"
    metrics << "\n-------\n"
    metrics << 'admin@sdpv.local'

    sdp_team = ['msq8@cdc.gov', 'ikk1@cdc.gov', 'oef1@cdc.gov', 'njj8@cdc.gov', 'lsj7@cdc.gov', 'nen8@cdc.gov', 'zoo3@cdc.gov', 'onk2@cdc.gov', 'wdd8@cdc.gov', 'oju3@cdc.gov', 'mpx1@cdc.gov', 'kff0@cdc.gov']
    metrics << "\n\nSDP Team: #{sdp_team.count}"
    metrics << "\n-------\n"
    sdp_team.map {|u| metrics << "#{u}, "}

    other_users = User.all.map { |u| u.email if u.email && !sdp_team.include?(u.email) && u.email != 'admin@sdpv.local' }.compact
    metrics << "\n\nCDC Program Users: #{other_users.count}"
    metrics << "\n-------\n"
    other_users.map {|u| metrics << "#{u}, "}

    metrics << "\n\nPrograms with content in the system: #{sp_count}"
    metrics << "\n-------\n"
    sp_names.map {|u| metrics << "#{u}, "}
    render html: metrics
  end
end
