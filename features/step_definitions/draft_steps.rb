Given(/^I have a published Question with the content "([^"]*)" and the description "([^"]*)" and the type "([^"]*)"\
 and the concept "([^"]*)"$/) do |content, description, type, concept|
  user  = get_user('test_author@gmail.com')
  qt314 = QuestionType.find_or_create_by(name: type)
  cq = Question.create!(content: content, description: description, question_type_id: qt314.id, version: 1, created_by: user,\
                        concepts_attributes: [{ value: '', display_name: concept, code_system: '' }])
  cq.publish
end

Given(/^I have a published Question with the content "([^"]*)" and the description "([^"]*)" and the type "([^"]*)"$/) do |content, description, type|
  user  = get_user('test_author@gmail.com')
  qt314 = QuestionType.find_or_create_by(name: type)
  cq = Question.create!(content: content, description: description, question_type_id: qt314.id, version: 1, created_by: user)
  cq.publish
end

Given(/^I have a published Question with the content "([^"]*)" and the type "([^"]*)"$/) do |content, type|
  user  = get_user('test_author@gmail.com')
  qt314 = QuestionType.find_or_create_by(name: type)
  cq = Question.create!(content: content, question_type_id: qt314.id, version: 1, created_by: user)
  cq.publish
end
