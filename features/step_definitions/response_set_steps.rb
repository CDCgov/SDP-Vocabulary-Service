Given(/^I have a Response Set with the name "([^"]*)" and the description "([^"]*)" and \
the author "([^"]*)" and with the Responses (.+)$/) do |set_name, desc, author, response_values|
  set = ResponseSet.create!(name: set_name, description: desc, author: author, version: 1)
  response_values.split(', ').each do |value|
    Response.create!(value: value, response_set_id: set['id'])
  end
end

When(/^I go to the list of Response Sets$/) do
  visit '/response_sets'
end

Given(/^I have a Response Set with the name "([^"]*)"$/) do |set_name|
  ResponseSet.create!(name: set_name, version: 1)
end

When(/^I click on the link to remove the Response "([^"]*)"$/) do |response_name|
  node = find('input[value="' + response_name + '"]')
  tr = node.find(:xpath, '../..')
  tr.click_on('Remove')
end
