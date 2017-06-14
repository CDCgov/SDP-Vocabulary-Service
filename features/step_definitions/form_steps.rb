Given(/^I have a Form with the name "([^"]*)" and the description "([^"]*)"$/) do |name, description|
  user = get_user 'test_author@gmail.com'
  Form.create!(name: name, description: description, created_by: user, status: 'draft')
end

Given(/^I have a Form with the name "([^"]*)"$/) do |name|
  user = get_user 'test_author@gmail.com'
  Form.create!(name: name, created_by: user, status: 'draft')
end

When(/^I use the response set search modal to select "([^"]*)"$/) do |name|
  Elastictest.fake_rs_search_results
  page.find('a', id: 'search-response-sets').click
  sleep 1
  page.all('a', id: "select-#{name}")[0].click
end

When(/^I go to the list of Forms$/) do
  Elastictest.fake_form_search_results
  visit '/'
  page.find('button[id="forms-analytics-item"]').click
end

When(/^I click on the button to add the Question "([^"]*)"$/) do |question_content|
  object_id = Question.find_by(content: question_content).id.to_s
  page.find("#question_#{object_id}_add").click
end

When(/^I use the question search to select "([^"]*)"$/) do |name|
  page.find('a', id: "select-#{name}").click
end

Then(/^I should see the question "([^"]*)" first$/) do |name|
  page.first('div', class: 'result-name').has_content?(name)
end

Then(/^I should see the response set "([^"]*)" second$/) do |name|
  page.all('a', class: 'panel-toggle')[0].click
  page.all('a', class: 'panel-toggle')[1].click
  page.all('div', class: 'result-details-content')[1].has_content?(name)
end

When(/^I click on the menu link for the Form with the (.+) "([^"]*)"$/) do |attribute, attribute_value|
  object_id = attribute_to_id('Form', attribute, attribute_value)
  page.find("#form_#{object_id}_menu").click
end

When(/^I move the Question "([^"]*)" (up|down)$/) do |question_content, direction|
  object_id = attribute_to_id('Question', 'content', question_content)
  old_index = page.find_all('.question-item').index { |el| el.has_css?("#form_question_id_#{object_id}") }
  page.all(".move-#{direction}")[1].click
  new_index = page.find_all('.question-item').index { |el| el.has_css?("#form_question_id_#{object_id}") }
  offset = direction.eql?('up') ? -1 : 1

  assert(old_index != new_index)
  assert(old_index + offset == new_index)
end

When(/^I click on the "([^"]*)" drop\-down option for "([^"]*)"$/) do |_arg1, arg2|
  oid = attribute_to_id('Question', 'content', arg2)
  menu = '//a[@id="question_' + oid + '_menu"]/following-sibling::ul'
  add_link = '#add_question_' + oid + '_to_form'
  page.find("#question_#{oid}_menu").click
  within(:xpath, menu) do
    page.find(add_link).click
  end
end

Then(/^I should see the link "([^"]*)"$/) do |link|
  page.find(link)
end

When(/^I select the ([^"]*) program variable option for the Question "([^"]*)"$/) do |action, question_content|
  object_id = attribute_to_id('Question', 'content', question_content)
  page.find("#form_question_#{object_id}_menu").click
  click_on("#{action.capitalize} Program Variable")
  sleep 1
end
