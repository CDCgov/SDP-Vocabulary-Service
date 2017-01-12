Given(/^I have a Form with the name "([^"]*)"$/) do |name|
  user = get_user 'test_author@gmail.com'
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

When(/^I move the Question "([^"]*)" (up|down)$/) do |question_content, direction|
  object_id = Question.search(question_content).first.id.to_s
  old_index = page.find_all('.question-item').index { |el| el.has_css?("#question_id_#{object_id}") }
  page.find("#question_id_#{object_id}").find(:xpath, '..').find(".move-#{direction}").click
  new_index = page.find_all('.question-item').index { |el| el.has_css?("#question_id_#{object_id}") }
  offset = direction.eql?('up') ? -1 : 1
  assert(old_index != new_index)
  assert(old_index + offset == new_index)
end
