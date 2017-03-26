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

When(/^I move the Form "([^"]*)" (up|down)$/) do |form_name, direction|
  object_id = attribute_to_id('Form', 'name', form_name)
  old_index = page.find_all('.survey-form').index { |el| el.matches_css?("#form_id_#{object_id}") }
  page.find(".survey-form#form_id_#{object_id}").find(".move-#{direction}").click
  new_index = page.find_all('.survey-form').index { |el| el.matches_css?("#form_id_#{object_id}") }
  offset = direction.eql?('up') ? -1 : 1

  assert(old_index != new_index)
  assert(old_index + offset == new_index)
end

When(/^I click on the "([^"]*)" drop\-down option for the form "([^"]*)"$/) do |_arg1, arg2|
  oid = attribute_to_id('Form', 'name', arg2)
  menu = '//a[@id="form_' + oid + '_menu"]/following-sibling::ul'
  add_link = '#action_for_' + oid
  page.find("#form_#{oid}_menu").click
  within(:xpath, menu) do
    page.find(add_link).click
  end
end
