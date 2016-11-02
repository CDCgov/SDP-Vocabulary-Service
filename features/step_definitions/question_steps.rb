Given(/^I have a Question with the content "([^"]*)" and the type "([^"]*)"$/) do |content, type|
  qt314 = QuestionType.create!(name: type)
  Question.create!(content: content, question_type_id: qt314.id)
end

When(/^I go to the list of Questions$/) do
  visit '/questions'
end
