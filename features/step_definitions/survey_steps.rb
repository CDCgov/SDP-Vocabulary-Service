Given(/^I have a Survey with the name "([^"]*)" and the description "([^"]*)"$/) do |name, description|
  user = get_user 'test_author@gmail.com'
  Survey.create!(name: name, description: description, created_by: user)
end

Given(/^I have a published Survey with the name "([^"]*)" and the description "([^"]*)"$/) do |name, description|
  user = get_user 'test_author@gmail.com'
  survey = Survey.create!(name: name, description: description, created_by: user)
  survey.publish
end

Given(/^I have a published Survey with the name "([^"]*)"$/) do |name|
  user = get_user 'test_author@gmail.com'
  survey = Survey.create!(name: name, created_by: user)
  survey.publish
end

Given(/^I have a Survey with the name "([^"]*)"$/) do |name|
  user = get_user 'test_author@gmail.com'
  Survey.create!(name: name, created_by: user)
end

When(/^I go to the list of Surveys$/) do
  Elastictest.fake_survey_search_results
  visit '/'
  page.find('li[id="surveys-analytics-item"]').click
end

When(/^I click on the menu link for the Survey with the (.+) "([^"]*)"$/) do |attribute, attribute_value|
  object_id = attribute_to_id('Survey', attribute, attribute_value)
  page.find("#survey_#{object_id}_menu").click
end
