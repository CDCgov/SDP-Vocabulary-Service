Given(/^I have a Response Set with the name "([^"]*)" and the description "([^"]*)" and \
with the Responses (.+)$/) do |set_name, desc, response_values|
  user = get_user 'test_author@gmail.com'
  set = ResponseSet.create!(name: set_name, description: desc, version: 1, created_by: user)
  response_values.split(', ').each do |value|
    Response.create!(value: value, response_set_id: set['id'])
  end
end

When(/^I go to the list of Response Sets$/) do
  visit '/response_sets'
end

Given(/^I have a Response Set with the name "([^"]*)"$/) do |set_name|
  user = get_user 'test_author@gmail.com'
  ResponseSet.create!(name: set_name, version: 1, created_by: user)
end

When(/^I click on the link to remove the Response "([^"]*)"$/) do |response_name|
  node = find('input[value="' + response_name + '"]')
  tr = node.find(:xpath, '../..')
  tr.click_on('Remove')
end
When(/^I click on the menu link for the Response Set with the (.+) "([^"]*)"$/) do |attribute, attribute_value|
  object_id = attribute_to_id('Response Set', attribute, attribute_value)
  page.find("#response_set_#{object_id}_menu").trigger('click')
end
