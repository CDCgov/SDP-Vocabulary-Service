Given(/^I have a Form with the name "([^"]*)"$/) do |name|
  user = User.create!(email: 'arbitr@ry.com', password: 'password')
  Form.create!(name: name, created_by: user)
end

When(/^I go to the list of Forms$/) do
  visit '/forms'
end

When(/^I click on the button to add the Question "([^"]*)"$/) do |question_content|
  object_id = Question.search(question_content).first.id.to_s
  page.find("#question_#{object_id}_add").trigger('click')
end

When(/^I click on the menu link for the Form with the (.+) "([^"]*)"$/) do |attribute, attribute_value|
  object_id = attribute_to_id('Form', attribute, attribute_value)
  page.find("#form_#{object_id}_menu").trigger('click')
end
