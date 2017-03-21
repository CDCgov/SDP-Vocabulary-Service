require_relative '../../test/elastic_helpers'

Given(/^I have a Question with the content "([^"]*)" and the description "([^"]*)" and the type "([^"]*)"\
 and the concept "([^"]*)"$/) do |content, description, type, concept|
  user  = get_user('test_author@gmail.com')
  qt314 = QuestionType.find_or_create_by(name: type)
  Question.create!(content: content, description: description, question_type_id: qt314.id, version: 1, created_by: user,\
                   concepts_attributes: [{ value: '', display_name: concept, code_system: '' }])
end

Given(/^I have a Question with the content "([^"]*)" and the description "([^"]*)" and the type "([^"]*)"$/) do |content, description, type|
  user  = get_user('test_author@gmail.com')
  qt314 = QuestionType.find_or_create_by(name: type)
  Question.create!(content: content, description: description, question_type_id: qt314.id, version: 1, created_by: user)
end

Given(/^I have a Question with the content "([^"]*)" and the type "([^"]*)"$/) do |content, type|
  user  = get_user('test_author@gmail.com')
  qt314 = QuestionType.find_or_create_by(name: type)
  Question.create!(content: content, question_type_id: qt314.id, version: 1, created_by: user)
end

Given(/^I have a Response Type with the name "([^"]*)"$/) do |name|
  ResponseType.create!(name: name)
end

When(/^I go to the list of Questions$/) do
  Elastictest.fake_question_search_results
  visit '/'
  page.find('li[id="questions-analytics-item"]').click
end

# When clauses
When(/^I click on the menu link for the Question with the (.+) "([^"]*)"$/) do |attribute, attribute_value|
  object_id = attribute_to_id('Question', attribute, attribute_value)
  page.find("#question_#{object_id}_menu").click
end

When(/^I check the (.*) box$/) do |box|
  check(box)
end
