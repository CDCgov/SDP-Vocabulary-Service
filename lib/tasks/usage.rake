namespace :usage do
  # Create a new user for the system
  task metrics: :environment do
    puts 'Reuse:'
    puts '-------'
    puts "Response Sets: #{QuestionResponseSet.group(:response_set_id).having('count(question_id) > 1').count.count}"
    puts "Questions: #{SectionQuestion.group(:question_id).having('count(section_id) > 1').count.count}"
    puts "Sections: #{SurveySection.group(:section_id).having('count(survey_id) > 1').count.count}"
    puts "\nExtensions:"
    puts '-----------'
    puts "Response Sets: #{ResponseSet.where.not(parent_id: nil).count}"
    puts "Questions: #{Question.where.not(parent_id: nil).count}"
    puts "Sections: #{Section.where.not(parent_id: nil).count}"
    puts "Surveys: #{Survey.where.not(parent_id: nil).count}"
  end
end
