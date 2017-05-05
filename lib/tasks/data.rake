namespace :data do
  task :load_test, [:user_email] => :environment do |_t, args|
    user = User.find_by(email: args.user_email)
    if user.nil?
      STDERR.puts "Unable to find user #{args.user_email}"
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

    form = Form.new(name: '500 Question Form', created_by: user, status: 'draft')
    500.times do |i|
      position = i + 1
      q = Question.create(content: "Is your favorite number #{position}?",
                          created_by: user, status: 'draft')
      fq = FormQuestion.new(question: q, position: position)
      form.form_questions << fq
    end
    form.save!
  end
end
