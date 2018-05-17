namespace :usage do
  # Create a new user for the system
  task metrics: :environment do
    puts 'Reuse:'
    puts '-------'
    puts "Response Sets: #{QuestionResponseSet.group(:response_set_id).having('count(question_id) > 1').count.count}"
    puts "Questions: #{SectionNestedItem.group(:question_id).having('count(section_id) > 1').count.count}"
    puts "Sections: #{SurveySection.group(:section_id).having('count(survey_id) > 1').count.count}"
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
