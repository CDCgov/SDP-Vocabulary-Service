Given(/^I have a Form with the name "([^"]*)"$/) do |name|
  Form.create!(name: name)
end

When(/^I go to the list of Forms$/) do
  visit '/forms'
end

When(/^I click on the button to add the Question "([^"]*)"$/) do |question_content|
  object_id = Question.search(question_content).first.id.to_s
  page.find("#question_#{object_id}_add").trigger('click')
end
