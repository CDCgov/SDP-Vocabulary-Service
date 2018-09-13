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
    puts "\nMetrics:"
    puts 'Total number of objects in the system:'
    puts '-------'
    puts "Response Sets: #{ResponseSet.all.count}"
    puts "Questions: #{Question.all.count}"
    puts "Sections: #{Section.all.count}"
    puts "Surveys: #{Survey.all.count}"
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
    puts "\nDuplicates Replaced:"
    puts '-----------'
    rs_sum = 0
    q_sum = 0
    Question.where.not(duplicates_replaced_count: 0).each { |q| q_sum += q.duplicates_replaced_count }
    ResponseSet.where.not(duplicates_replaced_count: 0).each { |rs| rs_sum += rs.duplicates_replaced_count }
    puts "Response Sets: #{rs_sum}"
    puts "Questions: #{q_sum}"
  end
end
