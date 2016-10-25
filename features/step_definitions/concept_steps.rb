Given(/^I have a Concept with the value "([^"]*)"$/) do |value|
  Concept.create!(value: value)
end

When(/^I go to the list of Concepts$/) do
  visit '/concepts'
end
