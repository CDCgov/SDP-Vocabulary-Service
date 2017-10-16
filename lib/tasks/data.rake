namespace :data do
  task :load_test, [:user_email] => :environment do |_t, args|
    user = User.find_by(email: args.user_email)
    if user.nil?
      STDERR.puts "Unable to find user #{args.user_email}"
      exit(-1)
    end

    boolean_rt = ResponseType.where(name: 'Boolean').first

    if boolean_rt.blank?
      STDERR.puts "Unable to Boolean ResponseType. Did you seed the database?"
      exit(-1)
    end

    rs = ResponseSet.new(created_by: user, status: 'draft',
                         name: '30 Code Response Set')
    responses = []
    30.times do |i|
      r = Response.new(value: "code-#{i}", code_system: 'test',
                       display_name: "Code #{i}")
      responses << r
    end
    rs.responses = responses
    rs.save!

    survey = Survey.new(name: '500 Question Survey', created_by: user, status: 'draft')
    ['a', 'b', 'c', 'd', 'e'].each_with_index do |section_letter, survey_position|
      f = Section.new(name: "Section #{section_letter} - 100 questions", created_by: user, status: 'draft')
      100.times do |i|
        position = i + 1
        q = Question.create(content: "Is your favorite letter #{section_letter} and number #{position}?",
                            created_by: user, status: 'draft', response_type: boolean_rt)
        fq = SectionQuestion.new(question: q, position: position)
        f.section_questions << fq
      end
      f.save!
      survey.survey_sections << SurveySection.new(forsectionm: f, position: survey_position)
    end
    survey.save!
    #wait for the async job queue to be processed
    sleep 60
  end
end
