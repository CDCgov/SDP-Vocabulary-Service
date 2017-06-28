Given(/^I have a published Question with the content "([^"]*)" and the description "([^"]*)" and the type "([^"]*)"\
 and the concept "([^"]*)"$/) do |content, description, type, concept|
  user  = get_user('test_author@gmail.com')
  qt314 = QuestionType.find_or_create_by(name: type)
  rt = ResponseType.where(code: 'choice').first
  cq = Question.create!(content: content, description: description, response_type_id: rt.id, question_type_id: qt314.id, version: 1,\
                        created_by: user, concepts_attributes: [{ value: '', display_name: concept, code_system: '' }])
  cq.publish(user)
end

Given(/^I have a published Question with the content "([^"]*)" and the description "([^"]*)" and the type "([^"]*)"$/) do |content, description, type|
  user  = get_user('test_author@gmail.com')
  qt314 = QuestionType.find_or_create_by(name: type)
  rt = ResponseType.where(code: 'choice').first
  cq = Question.create!(content: content, description: description, response_type_id: rt.id, question_type_id: qt314.id, version: 1, created_by: user)
  cq.publish(user)
end

Given(/^I have a published Question with the content "([^"]*)" and the type "([^"]*)"$/) do |content, type|
  user  = get_user('test_author@gmail.com')
  qt314 = QuestionType.find_or_create_by(name: type)
  rt = ResponseType.where(code: 'choice').first
  cq = Question.create!(content: content, response_type_id: rt.id, question_type_id: qt314.id, version: 1, created_by: user)
  cq.publish(user)
end

Given(/^I have a published Form with the name "([^"]*)" and the description "([^"]*)"$/) do |name, description|
  user = get_user 'test_author@gmail.com'
  form = Form.create!(name: name, description: description, created_by: user)
  form.publish(user)
end

Given(/^I have a published Form with the name "([^"]*)"$/) do |name|
  user = get_user 'test_author@gmail.com'
  form = Form.create!(name: name, created_by: user)
  form.publish(user)
end

Given(/^I have a published Response Set with the name "([^"]*)" and the description "([^"]*)" and\
 the response "([^"]*)"$/) do |set_name, desc, response|
  user = get_user 'test_author@gmail.com'
  rs = ResponseSet.create!(name: set_name, description: desc, version: 1, created_by: user,\
                           responses_attributes: [{ value: '', display_name: response, code_system: '' }])
  rs.publish(user)
end

Given(/^I have a published Response Set with the name "([^"]*)" and the description "([^"]*)" and \
with the Responses (.+)$/) do |set_name, desc, response_values|
  user = get_user 'test_author@gmail.com'
  set = ResponseSet.create!(name: set_name, description: desc, version: 1, created_by: user)
  response_values.split(', ').each do |value|
    Response.create!(value: value, response_set_id: set['id'])
  end
  set.publish(user)
end

Given(/^I have a published Response Set with the name "([^"]*)" and the description "([^"]*)"$/) do |set_name, desc|
  user = get_user 'test_author@gmail.com'
  rs = ResponseSet.create!(name: set_name, description: desc, version: 1, created_by: user)
  rs.publish(user)
end

Given(/^I have a published Response Set with the name "([^"]*)"$/) do |set_name|
  user = get_user 'test_author@gmail.com'
  rs = ResponseSet.create!(name: set_name, version: 1, created_by: user)
  rs.publish(user)
end
