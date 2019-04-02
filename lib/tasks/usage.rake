# rubocop:disable Metrics/BlockLength
# rubocop:disable Metrics/LineLength
# Disabling the above metrics because this is an admin rake task not actual large code base.
namespace :usage do
  # Create a new user for the system
  task metrics: :environment do
    puts 'Counting Question Reuse...'
    count_q = 0
    Question.all.map do |q|
      if q.sections.count > 1 || (q.sections.count == 1 && ((SectionNestedItem.where(nested_section_id: q.sections.first.id).count + SurveySection.where(section_id: q.sections.first.id).count) > 1))
        count_q += 1
      end
    end

    puts 'Counting Response Set Reuse...'
    count_rs = 0
    ResponseSet.all.map do |rs|
      if rs.sections.count > 1 || (rs.sections.count == 1 && ((SectionNestedItem.where(nested_section_id: rs.sections.first.id).count + SurveySection.where(section_id: rs.sections.first.id).count) > 1))
        count_rs += 1
      end
    end

    puts 'Counting Section Reuse...'
    count_s = 0
    Section.all.map do |s|
      if s.surveys.count > 1 || ((SectionNestedItem.where(nested_section_id: s.id).count + SurveySection.where(section_id: s.id).count) > 1)
        count_s += 1
      end
    end

    puts 'Calculating User Metrics...'
    user_info = User.all.map { |u| " #{u.email}, Program: #{u.last_program ? u.last_program.name : 'None'}, Sign in Count: #{u.sign_in_count} " }

    puts 'Calculating program Metrics...'
    sp_count = 0
    sp_names = SurveillanceProgram.all.map do |sp|
      if sp.surveys.count > 0
        sp_count += 1
        sp.name
      end
    end
    sp_names = sp_names.compact

    puts "\nMetrics:"

    puts 'Total number of objects in the system:'
    puts '-------'
    puts "Response Sets: #{ResponseSet.all.count}"
    puts "Questions: #{Question.all.count}"
    puts "Sections: #{Section.all.count}"
    puts "Surveys: #{Survey.all.count}"

    puts "\nPrivate objects in the system:"
    puts '-------'
    puts "Response Sets: #{ResponseSet.where(status: 'draft').count}"
    puts "Questions: #{Question.where(status: 'draft').count}"
    puts "Sections: #{Section.where(status: 'draft').count}"
    puts "Surveys: #{Survey.where(status: 'draft').count}"

    puts "\nPublic objects in the system:"
    puts '-------'
    puts "Response Sets: #{ResponseSet.where(status: 'published').count}"
    puts "Questions: #{Question.where(status: 'published').count}"
    puts "Sections: #{Section.where(status: 'published').count}"
    puts "Surveys: #{Survey.where(status: 'published').count}"

    puts "\nNumber of objects being reused (i.e. if the same question is used on 5 surveys it counts as 1 question being reused):"
    puts '-------'
    puts "Response Sets: #{count_rs}"
    puts "Questions: #{count_q}"
    puts "Sections: #{count_s}"

    puts "\nExtensions:"
    puts '-----------'
    puts "Response Sets: #{ResponseSet.where.not(parent_id: nil).count}"
    puts "Questions: #{Question.where.not(parent_id: nil).count}"
    puts "Sections: #{Section.where.not(parent_id: nil).count}"
    puts "Surveys: #{Survey.where.not(parent_id: nil).count}"

    puts "\nPreferred:"
    puts '-----------'
    puts "Response Sets: #{ResponseSet.where(preferred: true).count}"
    puts "Questions: #{Question.where(preferred: true).count}"

    puts "\nOMB Approved Survey Count: #{Survey.all.select { |s| s.control_number.present? }.compact.count}"

    puts "\nNumber of groups: #{Group.all.count}"
    puts "\nDuplicates Replaced:"
    puts '-----------'
    rs_sum = 0
    q_sum = 0
    Question.where.not(duplicates_replaced_count: 0).each { |q| q_sum += q.duplicates_replaced_count }
    ResponseSet.where.not(duplicates_replaced_count: 0).each { |rs| rs_sum += rs.duplicates_replaced_count }
    puts "Response Sets: #{rs_sum}"
    puts "Questions: #{q_sum}"

    puts "\nUser Info:"
    puts '-----------'
    user_info.each { |u| puts u }
    admin_users = User.all.map { |u| u.email if u.admin? }.compact

    puts "\nAdmins: #{admin_users.count}"
    puts '-----------'
    puts admin_users

    sdp_team = ['msq8@cdc.gov', 'ikk1@cdc.gov', 'oef1@cdc.gov', 'njj8@cdc.gov', 'lsj7@cdc.gov', 'nen8@cdc.gov', 'zoo3@cdc.gov', 'onk2@cdc.gov', 'wdd8@cdc.gov', 'oju3@cdc.gov', 'mpx1@cdc.gov', 'kff0@cdc.gov']
    puts "\nSDP Team: #{sdp_team.count}"
    puts '-----------'
    puts sdp_team

    other_users = User.all.map { |u| u.email if u.email && !sdp_team.include?(u.email) }.compact
    puts "\nCDC Program Users: #{other_users.count}"
    puts '-----------'
    puts other_users

    puts "\nPrograms with content in the system: #{sp_count}"
    puts '-----------'
    puts sp_names
  end
end
