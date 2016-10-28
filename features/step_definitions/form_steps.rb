Given(/^I have a Form with the name "([^"]*)"$/) do |name|
  Form.create!(name: name)
end

When(/^I go to the list of Forms$/) do
  visit '/forms'
end
