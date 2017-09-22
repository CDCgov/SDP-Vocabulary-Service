Given(/^I have a Question with the content "([^"]*)" and the description "([^"]*)" and the type "([^"]*)"\
 and the concept "([^"]*)"$/) do |content, description, type, concept|
  user  = get_user('test_author@gmail.com')
  qt314 = QuestionType.find_or_create_by(name: type)
  rt = ResponseType.where(code: 'choice').first
  Question.create!(content: content, description: description, response_type_id: rt.id, question_type_id: qt314.id, version: 1, created_by: user,\
                   concepts_attributes: [{ value: '', display_name: concept, code_system: '' }])
end

Given(/^I have a Question with the content "([^"]*)" and the description "([^"]*)" and the response type "([^"]*)"$/) do |content, description, type|
  user  = get_user('test_author@gmail.com')
  qt314 = ResponseType.find_or_create_by(name: type)
  Question.create!(content: content, description: description, response_type_id: qt314.id, version: 1, created_by: user)
end

Given(/^I have a Question with the content "([^"]*)" and the description "([^"]*)" and the type "([^"]*)"$/) do |content, description, type|
  user  = get_user('test_author@gmail.com')
  qt314 = QuestionType.find_or_create_by(name: type)
  rt = ResponseType.where(code: 'choice').first
  Question.create!(content: content, description: description, response_type_id: rt.id, question_type_id: qt314.id, version: 1, created_by: user)
end

Given(/^I have a Question with the content "([^"]*)" linked to Surveillance System "([^"]*)"$/) do |question_content, system_name|
  user = get_user 'test_author@gmail.com'
  ss = SurveillanceSystem.where(name: system_name).first
  q = Question.where(content: question_content).first
  q.response_type_id = ResponseType.where(code: 'choice').first.id
  q.update_attribute(:status, 'published')
  q.save!
  f = Form.new(name: 'test', created_by: user)
  f.form_questions << FormQuestion.new(question: q, position: 1)
  f.save!
  survey = Survey.new(name: 'test', surveillance_system: ss, created_by: user)
  survey.survey_forms << SurveyForm.new(form: f, position: 1)
  survey.save!
end

Given(/^I have a Question with the content "([^"]*)" and the description "([^"]*)"$/) do |content, description|
  user = get_user('test_author@gmail.com')
  rt = ResponseType.where(code: 'choice').first
  Question.create!(status: 'draft', content: content, description: description, response_type_id: rt.id, version: 1, created_by: user)
end

Given(/^I have a Question with the content "([^"]*)" and the type "([^"]*)"$/) do |content, type|
  user = get_user('test_author@gmail.com')
  qt314 = QuestionType.find_or_create_by(name: type)
  rt = ResponseType.where(code: 'choice').first
  Question.create!(content: content, question_type_id: qt314.id, response_type_id: rt.id, version: 1, created_by: user)
end

Given(/^I have a Response Type with the name "([^"]*)"$/) do |name|
  ResponseType.create!(name: name)
end

Given(/^I have a Response Type with the name "([^"]*)", description "([^"]*)" and code "([^"]*)"$/) do |name, description, code|
  ResponseType.create!(name: name, description: description, code: code)
end

When(/^I go to the list of Questions$/) do
  Elastictest.fake_question_search_results
  visit '/'
  page.find('button[id="questions-analytics-item"]').click
end

Given(/^I have a published Question with the content "([^"]*)"$/) do |content|
  user = get_user('test_author@gmail.com')
  rt = ResponseType.where(code: 'choice').first
  q = Question.create!(content: content, response_type_id: rt.id, version: 1, created_by: user)
  q.publish(user)
end

# When clauses
When(/^I click on the menu link for the Question with the (.+) "([^"]*)"$/) do |attribute, attribute_value|
  object_id = attribute_to_id('Question', attribute, attribute_value)
  page.find("#question_#{object_id}_menu").click
end

When(/^I check the (.*) box$/) do |box|
  check(box)
end

Then(/^I navigate to a question created by "(.+)"$/) do |owner_email|
  user = get_user(owner_email)
  rt = ResponseType.where(code: 'choice').first
  question = Question.create!(status: 'draft', content: 'content', response_type_id: rt.id, description: 'description', version: 1, created_by: user)
  visit "#/questions/#{question.id}"
end

Then(/^I should only see (.+) copy of the "(.+)" response set associated$/) do |expected_count, rs_name|
  # Add 1 for finding in search result list
  count = expected_count.to_i + 1
  assert_equal(count, page.all('div', class: 'unlinked-result-name', text: rs_name).length)
end
