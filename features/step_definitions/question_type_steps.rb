Given(/^I have a Question Type with the name "([^"]*)"$/) do |name|
  QuestionType.create!(name: name)
end

When(/^I go to the list of Question Types$/) do
  visit '/question_types/'
end
