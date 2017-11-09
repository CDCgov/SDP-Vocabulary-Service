Given(/^I have a Category with the name "([^"]*)"$/) do |name|
  Category.create!(name: name)
end

When(/^I go to the list of Categories$/) do
  visit '/categories/'
end
