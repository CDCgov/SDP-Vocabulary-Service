Given(/^I have a Question with the content "([^"]*)" and the type "([^"]*)"$/) do |content, type|
  qt314 = QuestionType.create!(name: type)
  Question.create!(content: content, question_type_id: qt314.id, version_independent_id: 1)
end

When(/^I go to the list of Questions$/) do
  visit '/questions'
end

# When clauses
When(/^I click on the menu link for the Question with the (.+) "([^"]*)"$/) do |attribute, attribute_value|
  object_id = attribute_to_id('Question', attribute, attribute_value)
  page.find("#question_#{object_id}_menu").trigger('click')
end
