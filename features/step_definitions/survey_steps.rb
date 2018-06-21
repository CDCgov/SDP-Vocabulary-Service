Given(/^I have a Survey with the name "([^"]*)" and the description "([^"]*)"$/) do |name, description|
  user = get_user 'test_author@gmail.com'
  Survey.create!(name: name, description: description, created_by: user)
end

Given(/^I have a published Survey with the name "([^"]*)" and the description "([^"]*)"$/) do |name, description|
  user = get_user 'test_author@gmail.com'
  survey = Survey.create!(name: name, description: description, created_by: user)
  survey.publish(user)
end

Given(/^I have a published Survey with the name "([^"]*)"$/) do |name|
  user = get_user 'test_author@gmail.com'
  survey = Survey.create!(name: name, created_by: user)
  survey.publish(user)
end

Given(/^I have a Survey with the name "([^"]*)"$/) do |name|
  user = get_user 'test_author@gmail.com'
  Survey.create!(name: name, created_by: user)
end

When(/^I go to the list of Surveys$/) do
  Elastictest.fake_survey_search_results
  visit '/'
  page.find('button[id="surveys-analytics-item"]').click
end

When(/^I use the section search to select "([^"]*)"$/) do |name|
  page.find('a', id: "select-#{name}").click
end

When(/^I attach an MMG to the "([^"]*)" input$/) do |input_name|
  file_path = Rails.root + 'test/fixtures/files/TestMMG.xlsx'
  attach_file(input_name, file_path)
end

When(/^I attach an MMG with a blank sheet to the "([^"]*)" input$/) do |input_name|
  file_path = Rails.root + 'test/fixtures/files/TestMMGBlank.xlsx'
  attach_file(input_name, file_path)
end

When(/^I attach an MMG with no data to the "([^"]*)" input$/) do |input_name|
  file_path = Rails.root + 'test/fixtures/files/TestMMGNoData.xlsx'
  attach_file(input_name, file_path)
end

When(/^I attach a generic spreadsheet to the "([^"]*)" input$/) do |input_name|
  file_path = Rails.root + 'test/fixtures/files/TestGenericTemplateMini.xlsx'
  attach_file(input_name, file_path)
end

When(/^I attach a generic spreadsheet with bad format to the "([^"]*)" input$/) do |input_name|
  file_path = Rails.root + 'test/fixtures/files/TestGenericTemplateBad.xlsx'
  attach_file(input_name, file_path)
end

When(/^I click on the menu link for the Survey with the (.+) "([^"]*)"$/) do |attribute, attribute_value|
  object_id = attribute_to_id('Survey', attribute, attribute_value)
  page.find("#survey_#{object_id}_menu").click
end

When(/^I move the Section "([^"]*)" (up|down)$/) do |section_name, direction|
  object_id = attribute_to_id('Section', 'name', section_name)
  old_index = page.find_all('.survey-section').index { |el| el.has_css?("#survey_section_id_#{object_id}") }
  page.all(".move-#{direction}")[old_index].click
  new_index = page.find_all('.survey-section').index { |el| el.has_css?("#survey_section_id_#{object_id}") }
  offset = direction.eql?('up') ? -1 : 1
  assert(old_index != new_index)
  assert(old_index + offset == new_index)
end

When(/^I click on the "([^"]*)" drop\-down option for the section "([^"]*)"$/) do |_arg1, arg2|
  oid = attribute_to_id('Section', 'name', arg2)
  menu = '//a[@id="section_' + oid + '_menu"]/following-sibling::ul'
  add_link = '#action_for_' + oid
  page.find("#section_#{oid}_menu").click
  within(:xpath, menu) do
    page.find(add_link).click
  end
end
